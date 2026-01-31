const KEY = "fzrbx_value"
const MAX_VALUE = 1_000_000_000_000
const ORIGINAL_ATTR = "data-fzrbx-original"

function toNumber(value) {
  if (typeof value === "string") {
    const cleaned = value.replace(/[.,\s]/g, "")
    if (!cleaned) return NaN
    value = Number(cleaned)
  }

  if (!Number.isFinite(value)) return NaN
  if (value < 0 || value > MAX_VALUE) return NaN

  return value
}

function format(num) {
  num = toNumber(num)
  if (isNaN(num)) return ""

  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000)
      .toFixed(num % 1_000_000_000 === 0 ? 0 : 1)
      .replace(".0", "") + "B+"
  }

  if (num >= 1_000_000) {
    return (num / 1_000_000)
      .toFixed(num % 1_000_000 === 0 ? 0 : 1)
      .replace(".0", "") + "M+"
  }

  if (num >= 1_000) {
    return (num / 1_000)
      .toFixed(num % 1_000 === 0 ? 0 : 1)
      .replace(".0", "") + "K+"
  }

  return String(num)
}

function applyFake() {
  chrome.storage.local.get(KEY, data => {
    const span = document.getElementById("nav-robux-amount")
    if (!span) return

    if (!data[KEY]) {
      const original = span.getAttribute(ORIGINAL_ATTR)
      if (original) {
        span.textContent = original
        span.removeAttribute(ORIGINAL_ATTR)
      }
      return
    }

    const n = toNumber(data[KEY])
    if (isNaN(n)) {
      const original = span.getAttribute(ORIGINAL_ATTR)
      if (original) {
        span.textContent = original
        span.removeAttribute(ORIGINAL_ATTR)
      }
      return
    }

    if (!span.getAttribute(ORIGINAL_ATTR)) {
      span.setAttribute(ORIGINAL_ATTR, span.textContent || "")
    }

    span.textContent = format(n)
  })
}

const observer = new MutationObserver(applyFake)
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
})

document.addEventListener("DOMContentLoaded", applyFake)
window.addEventListener("load", applyFake)

setInterval(applyFake, 3000)

chrome.runtime.onMessage.addListener(() => {
  applyFake()
})
