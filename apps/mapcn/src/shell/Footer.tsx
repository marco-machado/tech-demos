export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-[13px] leading-[1.6] text-quiet sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="max-w-[42rem]">
          Map components are MIT registry source from{' '}
          <a className="link" href="https://mapcn.dev" rel="noreferrer" target="_blank">
            mapcn.dev
          </a>
          , vendored into this app. The pick came from the{' '}
          <a
            className="link"
            href="https://app.notion.com/p/30e89ff326a181c486bcd9aa7b30ba15"
            rel="noreferrer"
            target="_blank"
          >
            Notion inbox
          </a>
          . Default tiles are CARTO Positron / Dark Matter.
        </p>
        <span className="mono shrink-0 text-[11px] text-faint">apps/mapcn · /mapcn/</span>
      </div>
    </footer>
  )
}
