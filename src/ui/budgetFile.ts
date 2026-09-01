/** Getting the text of the budget file out of the platform.
 *
 *  Deliberately dull. It decides nothing about what a budget is — that is the
 *  core's job — and holds no state. All it knows is that two platforms offer
 *  two different pickers, and that both of them can hand back a file the
 *  operator chose from Google Drive.
 *
 *  The operator picks the file every time the app opens. That is not a fallback
 *  for a lost permission; ADR-0002 makes it the designed step, because File
 *  System Access permissions do not reliably survive a browser restart on
 *  either platform. */

type FileHandle = { getFile: () => Promise<File> }
type ShowOpenFilePicker = (options?: {
  multiple?: boolean
  types?: readonly { description: string; accept: Record<string, readonly string[]> }[]
}) => Promise<readonly FileHandle[]>

/** The File System Access API, which Chrome and Edge have on Windows and which
 *  Chrome on Android does not. Where it is missing a plain file input stands in:
 *  it reads a copy of the chosen file rather than opening the file itself, which
 *  is enough to display a month and will not be enough to save one. */
function openFilePicker(): ShowOpenFilePicker | undefined {
  const candidate = (window as unknown as { showOpenFilePicker?: unknown }).showOpenFilePicker
  return typeof candidate === 'function' ? (candidate as ShowOpenFilePicker) : undefined
}

/** What came back from asking the operator for a file.
 *
 *  `cancelled` and `unreadable` are kept apart on purpose. Closing the picker
 *  should leave the screen exactly as it was; a file that genuinely could not be
 *  read — Drive has not fetched it down yet, the card was pulled — has to say
 *  so, or the operator taps the button and nothing at all happens. */
export type PickOutcome =
  | { readonly picked: true; readonly name: string; readonly text: string }
  | { readonly picked: false; readonly cancelled: true }
  | { readonly picked: false; readonly cancelled: false }

const CANCELLED = { picked: false, cancelled: true } as const
const UNREADABLE = { picked: false, cancelled: false } as const

/** `fileTypeLabel` is what the operating system's own picker shows as the
 *  file-type filter. It arrives already translated: this adapter knows nothing
 *  about languages, and the words still come from the catalogue. */
export async function pickBudgetFile(fileTypeLabel: string): Promise<PickOutcome> {
  const picker = openFilePicker()
  const file =
    picker === undefined ? await pickViaInput() : await pickViaHandle(picker, fileTypeLabel)
  if (file === undefined) return CANCELLED

  try {
    return { picked: true, name: file.name, text: await file.text() }
  } catch {
    return UNREADABLE
  }
}

async function pickViaHandle(
  picker: ShowOpenFilePicker,
  fileTypeLabel: string,
): Promise<File | undefined> {
  try {
    const [handle] = await picker({
      multiple: false,
      types: [{ description: fileTypeLabel, accept: { 'application/json': ['.json'] } }],
    })
    return handle === undefined ? undefined : await handle.getFile()
  } catch {
    // Dismissing the picker is reported by throwing, and is by far the likeliest
    // thing to arrive here. A file that opens but will not read is caught by the
    // separate `text()` above, which is the failure worth telling apart.
    return undefined
  }
}

/** Chrome on Android has no File System Access API, so the file arrives through
 *  an ordinary file input. The Android picker lists Drive among its providers,
 *  which is how the phone reaches the same document as the desktop. */
function pickViaInput(): Promise<File | undefined> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    // Deliberately unfiltered. Android's Drive provider often hands a file over
    // as `application/octet-stream` behind a `content://` URI, and an `accept`
    // filter can grey exactly those out — on the one path this ticket exists to
    // prove. Showing every file is the smaller cost.
    input.style.display = 'none'

    const finish = (file: File | undefined) => {
      input.remove()
      resolve(file)
    }

    input.addEventListener('change', () => finish(input.files?.[0] ?? undefined), { once: true })
    // Fired when the operator backs out of the picker; Chrome has sent it since
    // 113. Where it is not sent this promise never settles, but the button is
    // never disabled, so tapping it again opens a fresh picker — the cost is a
    // leaked promise, not a stuck screen.
    input.addEventListener('cancel', () => finish(undefined), { once: true })

    document.body.append(input)
    input.click()
  })
}
