const KEY = "fzrbx_value"
const LANG_KEY = "fzrbx_lang"
const MAX_VALUE = 1_000_000_000_000

const input = document.getElementById("value")
const statusEl = document.getElementById("status")
const langSelect = document.getElementById("lang")

const I18N = {
  "pt-BR": {
    title: "FZRBX",
    desc: "Mostra um valor falso de Robux so para voce.",
    placeholder: "robux fake",
    apply: "apply",
    reset: "reset",
    errors: {
      empty: "Digite um valor.",
      invalid: "Use apenas numeros e separadores comuns.",
      invalidValue: "Valor invalido.",
      tooHigh: "Valor muito alto."
    },
    status: {
      applied: "Aplicado!",
      reset: "Resetado."
    }
  },
  en: {
    title: "FZRBX",
    desc: "Shows a fake Robux value just for you.",
    placeholder: "fake robux",
    apply: "apply",
    reset: "reset",
    errors: {
      empty: "Enter a value.",
      invalid: "Use only numbers and common separators.",
      invalidValue: "Invalid value.",
      tooHigh: "Value too high."
    },
    status: {
      applied: "Applied!",
      reset: "Reset."
    }
  },
  es: {
    title: "FZRBX",
    desc: "Muestra un valor falso de Robux solo para ti.",
    placeholder: "robux falso",
    apply: "apply",
    reset: "reset",
    errors: {
      empty: "Ingresa un valor.",
      invalid: "Usa solo numeros y separadores comunes.",
      invalidValue: "Valor invalido.",
      tooHigh: "Valor demasiado alto."
    },
    status: {
      applied: "Aplicado!",
      reset: "Reiniciado."
    }
  }
}

let currentLang = "pt-BR"

function t(path) {
  const parts = path.split(".")
  let value = I18N[currentLang]
  for (const part of parts) {
    value = value?.[part]
  }
  return value ?? ""
}

function applyI18n() {
  document.documentElement.lang = currentLang
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n)
  })
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder))
  })
}

function setStatus(message, type = "info") {
  statusEl.textContent = message
  statusEl.dataset.type = type
}

function parseValue(raw) {
  const trimmed = raw.trim()
  if (!trimmed) return { error: t("errors.empty") }

  const cleaned = trimmed.replace(/[.,\s]/g, "")
  if (!/^\d+$/.test(cleaned)) {
    return { error: t("errors.invalid") }
  }

  const number = Number(cleaned)
  if (!Number.isFinite(number)) return { error: t("errors.invalidValue") }
  if (number < 0 || number > MAX_VALUE) {
    return { error: t("errors.tooHigh") }
  }

  return { value: String(number) }
}

document.getElementById("apply").onclick = () => {
  const { value, error } = parseValue(input.value)
  if (error) {
    setStatus(error, "error")
    input.focus()
    return
  }

  chrome.storage.local.set({ [KEY]: value }, () => {
    setStatus(t("status.applied"), "success")
  })
}

document.getElementById("reset").onclick = () => {
  chrome.storage.local.remove(KEY, () => {
    setStatus(t("status.reset"), "info")
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage?.(tabs[0].id, {})
    })
  })
}

langSelect.addEventListener("change", () => {
  currentLang = langSelect.value
  chrome.storage.local.set({ [LANG_KEY]: currentLang }, () => {
    applyI18n()
  })
})

chrome.storage.local.get([LANG_KEY], data => {
  currentLang = data[LANG_KEY] || "pt-BR"
  langSelect.value = currentLang
  applyI18n()
})
