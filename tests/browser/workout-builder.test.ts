import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, type Page } from 'playwright'
import { preview } from 'vite'

async function assertDuration(page: Page, duration: string) {
  await page.waitForFunction(expected => document.querySelector('.total strong')?.textContent === expected, duration)
  assert.equal(await page.locator('.phase-list strong').textContent(), duration)
}

async function assertNarrowLayout(page: Page) {
  const dimensions = await page.evaluate(() => {
    const button = document.querySelector('button')?.getBoundingClientRect()
    const panel = document.querySelector('.panel')!.getBoundingClientRect()
    return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      buttonRight: button?.right, panelRight: panel.right }
  })
  assert.equal(dimensions.scrollWidth, dimensions.width, 'no horizontal page overflow')
  if (dimensions.buttonRight !== undefined) {
    assert.ok(dimensions.buttonRight <= dimensions.panelRight, 'Add button fits inside its panel')
  }
}

test('production workout editor preserves raw input, accessible focus, narrow layouts and offline editing', { timeout: 60000 }, async t => {
  // A separate ephemeral port avoids changing or relying on a person's running preview.
  const server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true } })
  t.after(() => new Promise<void>((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve())))
  const browser = await chromium.launch()
  t.after(() => browser.close())
  const context = await browser.newContext({ viewport: { width: 320, height: 800 } })
  const page = await context.newPage()
  const errors: string[] = []
  const requests: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('request', request => requests.push(request.url()))
  await page.goto(server.resolvedUrls!.local[0]!)
  await page.getByRole('button', { name: 'Add run phase' }).waitFor()
  await page.addStyleTag({ content: ':root { font-size: 200%; }' })
  assert.equal(await page.locator('.total strong').textContent(), '0:00')
  assert.equal(await page.locator('.phase-list li').count(), 0)
  await assertNarrowLayout(page)

  await page.keyboard.press('Tab')
  assert.equal(await page.getByRole('button', { name: 'Add run phase' }).evaluate(element => element === document.activeElement), true)
  await page.keyboard.press('Enter')
  const minutes = page.getByLabel('Minutes', { exact: true })
  const seconds = page.getByLabel('Seconds', { exact: true })
  await minutes.waitFor()
  assert.equal(await minutes.evaluate(element => element === document.activeElement), true)
  assert.equal(await minutes.inputValue(), '')
  assert.equal(await seconds.inputValue(), '')
  assert.equal(await page.locator('.field-error').count(), 0, 'initial automatic focus shows no errors')
  assert.equal(await minutes.getAttribute('aria-invalid'), 'false')
  await seconds.focus()
  assert.equal(await page.locator('#minutes-error').textContent(), 'Enter minutes; use 0 if none.')
  assert.equal(await page.locator('#seconds-error').count(), 0, 'untouched seconds has no error')
  await minutes.focus()
  assert.equal(await page.locator('#minutes-error').count(), 0, 'refocusing clears displayed error')
  assert.equal(await minutes.getAttribute('aria-invalid'), 'false')
  assert.equal(await minutes.getAttribute('aria-describedby'), 'duration-help')
  assert.equal(await page.locator('#seconds-error').locator('..').getAttribute('aria-live'), 'polite')
  assert.equal(await page.locator('#seconds-error').textContent(), 'Enter seconds; use 0 if none.')
  assert.equal(await page.locator('.total strong').textContent(), 'Incomplete')
  assert.equal(await page.getByRole('button', { name: 'Add run phase' }).count(), 0)
  assert.equal(await page.locator('.phase-list li').count(), 1)

  await minutes.fill('2')
  await page.keyboard.press('Tab')
  assert.equal(await seconds.evaluate(element => element === document.activeElement), true)
  await seconds.fill('30')
  await assertDuration(page, '2:30')
  await minutes.fill('0')
  await assertDuration(page, '0:30')

  for (const [field, value] of [
    ['minutes', ''], ['minutes', '-1'], ['minutes', '1.5'], ['minutes', 'abc'],
    ['minutes', 'Infinity'], ['minutes', '9007199254740992'], ['seconds', '60'],
  ] as const) {
    const input = field === 'minutes' ? minutes : seconds
    await input.fill(value)
    await page.waitForFunction(() => document.querySelector('.total strong')?.textContent === 'Incomplete')
    assert.equal(await input.inputValue(), value, 'invalid raw input is preserved')
    await input.focus()
    assert.equal(await page.locator(`#${field}-error`).count(), 0, 'focused editing does not display errors')
    await input.blur()
    assert.equal(await input.getAttribute('aria-invalid'), 'true')
    assert.ok((await input.getAttribute('aria-describedby'))?.includes(`${field}-error`))
    assert.ok(await page.locator(`#${field}-error`).textContent())
    await assertNarrowLayout(page)
    await minutes.fill('0')
    await seconds.fill('30')
    await assertDuration(page, '0:30')
    assert.equal(await page.locator('[aria-invalid="true"]').count(), 0)
  }

  await minutes.fill('0')
  await seconds.fill('0')
  await seconds.blur()
  assert.ok(await page.locator('#seconds-error').textContent(), 'zero-duration error appears on blur')
  await minutes.fill('1')
  assert.equal(await page.locator('.field-error').count(), 0, 'correction clears obsolete cross-field error')
  await seconds.fill('0')
  await seconds.blur()
  await minutes.fill('0')
  assert.equal(await page.locator('#seconds-error').count(), 0, 'typing another field cannot introduce an error')
  await minutes.blur()
  assert.ok(await page.locator('#minutes-error').textContent())

  await seconds.fill('1')
  assert.equal(await page.locator('#minutes-error').count(), 0, 'seconds correction clears obsolete minutes error')
  await minutes.fill('abc')
  await minutes.blur()
  await seconds.fill('60')
  await seconds.blur()
  assert.ok(await page.locator('#minutes-error').textContent(), 'unrelated minutes error remains')
  await assertNarrowLayout(page)
  await seconds.fill('30')
  assert.ok(await page.locator('#minutes-error').textContent(), 'correcting seconds preserves invalid minutes feedback')
  await minutes.fill('150119987579016')
  await seconds.fill('31')
  await assertDuration(page, '150119987579016:31')
  await assertNarrowLayout(page)
  assert.ok(requests.every(url => new URL(url).origin === new URL(page.url()).origin))

  await context.setOffline(true)
  const beforeEditing = requests.length
  await minutes.fill('0')
  await seconds.fill('45')
  await assertDuration(page, '0:45')
  assert.equal(requests.length, beforeEditing, 'offline editing makes no requests')
  assert.deepEqual(errors, [])
})
