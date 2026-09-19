export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-8 text-[13px] leading-[1.6] text-quiet sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="max-w-[40rem]">
          Pieces are MIT registry source from{' '}
          <a className="link" href="https://cult-ui.com" rel="noreferrer" target="_blank">
            cult-ui.com
          </a>
          , vendored into this app. The pick came from the{' '}
          <a
            className="link"
            href="https://app.notion.com/37189ff326a1816db52fcacf29a21641"
            rel="noreferrer"
            target="_blank"
          >
            Notion inbox
          </a>
          .
        </p>
        <span className="mono shrink-0 text-[11px] text-faint">apps/cult-ui · /cult-ui/</span>
      </div>
    </footer>
  )
}
