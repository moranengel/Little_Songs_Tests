# גרסת בדיקות — זמן לשיר

זו סביבת הבדיקות של Moran. בודקים כאן שדרוגים ומפיצים לגרסה הרגילה רק לאחר אישור מפורש.

- בסיס: הקומיט a5a079896cbe7436decf16c005b49893deb8091c של הגרסה הרגילה.
- מאגר הבדיקות: moranengel/Little_Songs_Tests.
- ספריית השירים נפרדת (little-songs-test-v1). אפשר לייבא עותק מגיבוי כדי לבדוק עם אותם שירים.
- האייקון למסך הבית נקרא ״שירים — בדיקות״, ועל המסך מופיע ״גרסת בדיקות״.
- גרסת הבדיקות אינה מנגנון הרשאות: אם מפורסמת ב־GitHub Pages ציבורי, כל מי שמקבל את הקישור יכול לפתוח אותה. השירים שהמשתמש מייבא דרך הנגן אינם עולים לשרת.
- מאגר הבדיקות צריך להפעיל Pages בענף main ובתיקיית root, לאחר שהקוד הועתק אליו.

## לפני הפצה

בודקים הוספה, ניגון, חיפוש, עריכה, גיבוי ושחזור ואופליין באייפון, ובאנדרואיד אם רלוונטי. לאחר אישור, מעבירים רק את התוספת שאושרה ומוודאים שהשמות של האחסון והאפליקציה בגרסה הרגילה נשמרים.

## שדרוג הפלייליסטים

- תו נגינה בצבעי קשת פותח תפריט צד מימין, עם ״כל השירים״ ופלייליסטים אישיים.
- יצירה ועריכה זמינות בתפריט ובהגדרות. בוחרים שם, אימוג׳י וצבע ומסמנים כמה שירים. שיר יכול להשתייך לכמה רשימות.
- בחירת רשימה סוגרת את התפריט, מציגה את שמה ואת שיריה בלבד. החיפוש מסנן בתוך הרשימה.
- בהגדרות → עריכת שירים מופיעים כפתורי הזזה למעלה/למטה והסרה מפלייליסט. שינוי הסדר מחזיר ל״סדר ידני״; אפשר גם לבחור מיון לפי שם.
- הסרה מפלייליסט אינה מוחקת שיר. מחיקת שיר מהספרייה מבקשת אישור ומסירה אותו מכל הרשימות. מחיקת פלייליסט משאירה את השירים בספרייה.
- ייבוא כשפלייליסט פעיל מוסיף את הקבצים גם לספרייה וגם לאותה רשימה. רשימה ריקה מציעה בחירה מהספרייה או ייבוא קבצים.
- הנגינה רציפה; ללא חזרה היא נעצרת בסוף הרשימה. יש ערבוב וחזרה על שיר או רשימה. מעבר לצפייה ברשימה אחרת אינו משנה את הנגינה, עד בחירת שיר חדש. ״הבא״ ו״הקודם״ ממשיכים לפי רשימת הנגינה הפעילה, שאותה מציג הנגן.
- הגיבוי מכיל את כל הספרייה וכל הרשימות, גם כשמוצגת רק רשימה אחת או חיפוש. גרסה 2 כוללת סדר ושיוכים; ניתן לשחזר גם גיבויי שירים ישנים מגרסה 1. גיבויי גרסה 2 מיועדים בשלב זה לגרסת הבדיקות; הגרסה הרגילה טרם עודכנה לקריאתם.

בדיקות אוטומטיות: backup, assets, staging, playlists. בדיקות ממשק שבוצעו: יצירת שתי רשימות, שיוך חופף, חיפוש בתוך רשימה, סדר ידני, מעבר רשימה בזמן נגינה, מעבר אוטומטי לשיר הבא ועצירה בסוף, רשימה ריקה, ייבוא אליה, הורדה וגיבוי מלא, מחיקה ושחזור רשימה. נבדקה גם תצוגה ברוחב 390 פיקסלים; עדיין נדרשת בדיקה באייפון אמיתי, לרבות השמעה ברקע ותפריט השיתוף של iOS.

## תיקוני תצוגה וגיבוי

תו התפריט משתמש באותו נכס תמונה כמו אייקון מסך הבית. תזכורת הגיבוי המרחבית הוסרה; אייקון שמירה ליד ההגדרות זמין רק כאשר revision גדול מ־savedRevision. פתיחה, הורדה או ביטול שמירה אינם מסמנים גיבוי כנשמר: נדרש אישור המשתמש לאחר השמירה. השם המוצע תמיד Backup.little-songs. באייפון האתר אינו יכול לדרוס בשקט קובץ קיים; יש לשמור באותה תיקייה ולבחור החלפה בחלון השמירה אם מתבקשת. הדפדפן עשוי להוסיף מספר לשם אם לא נבחרת החלפה.

״סדר ידני״ הוא הסדר הראשוני/הסדר שנקבע באמצעות כפתורי החצים בעריכת שירים. ״לפי שם״ ממיין אוטומטית לפי א–ת. ההסבר מוצג במצב העריכה.

אייקון השמירה מפעיל כעת שמירת קובץ ישירות, בלי לפתוח את ההגדרות. אם דרושה הכנה/הורדה, לאחריה נדרשת לחיצה נוספת כדי לשמור על מחוות המשתמש הנדרשת ב־iOS. לאחר פתיחת השמירה מוצג אישור ייעודי קצר: ״כן, שמרתי״ מסמן את גרסת הגיבוי כשמורה; ״עוד לא״ או ביטול משאירים את החיווי פעיל. ההשמעה נותרה ללא שינוי; המשתמשת דיווחה שטעינת הגיבוי מחדש פתרה את בעיית בחירת השיר.

## Playlist layout verification

The drawer header keeps the create (+) and close controls visible while only its playlist list scrolls. A click on the backdrop closes the drawer. The playlist editor has a viewport-fitting fixed height; only the song selector scrolls. Verified in a browser with 22 playlists and 25 tracks, including a 390 × 844 viewport, both new and existing playlists. Backup downloads use `Backup.little-songs`.

## Playlist title and song ordering

Clicking a custom playlist title opens its editor. All Songs remains plain text. In the editor, Song Ordering shows selected songs only, with pointer/touch handles and accessible up/down buttons. Membership selection and ordering share an unsaved draft; closing discards it. Save commits order for that playlist only and switches to manual sorting after a move. Existing archive metadata preserves the order without a format change.

Browser checks at 390 × 844: title opening, arrow moves, pointer drag, cancellation, isolation between playlists, switching from name to manual sort, persistence after reload, and no outer editor overflow.

## Rainbow note icon

The menu, favicon and installation icons share a single musical note filled with rainbow colors. Versioned icon filenames avoid reusing the previous arch icon from cache. Existing home-screen shortcuts may need to be recreated for iOS to refresh their icon.

## Drawer backdrop fix

The plus is a plain SVG with no circular background. The modal now spans the viewport with an explicit backdrop button behind a separate right-hand panel, instead of relying on pointer events on the native dialog backdrop. Browser QA in a 390 × 844 frame verified outside-click dismissal, inside-click retention, plus opening the editor, and X closing the drawer. Real-device Safari verification remains with the tester.

## Safety and library management release — 2026.11.14.1-test

- Optional child mode is stored locally and starts locked on each reload. A math challenge unlocks the adult session. The top lock button or backgrounding the page locks it again. This prevents accidental changes; it is not authentication or encryption. Browsing playlists and playback remain available.
- Imports compare SHA-256 of actual bytes, including existing legacy blobs hashed lazily. Same bytes with a different filename do not add a second track; an existing song can be linked to the selected playlist after confirmation. Existing duplicates are not removed automatically, and un-downloaded catalog audio is not compared.
- Deletion is recoverable: audio blobs remain local, and playlist membership/order is recorded. Undo is offered for 12 seconds; recovery remains available in Settings after a reload. Permanent deletion is a separate confirmed action. Old hidden catalog songs are migrated into recovery entries. Deleted items are excluded from backups and still consume storage until permanently deleted.
- Settings shows active/offline counts, audio bytes, deleted bytes, approximate backup audio size, origin storage estimates, and the last user-confirmed backup status. Estimates describe the browser origin, not phone free space.
- The current app version is visible. A network-only version.json check offers an explicit reload when another version is published. No automatic page reload interrupts playback or drafts. Future releases must update APP_VERSION and version.json together, bump the shell cache, regenerate assets and run tests.
- CSP limits code, network and media sources. Audio import/download and backup restore have size limits: 100 MiB per track, 1 GiB per archive. Streamed downloads are bounded even without Content-Length. Export refuses oversize tracks before hashing, so it cannot emit a backup the importer rejects.
- GitHub account security, separate-origin hosting and backup encryption are not changed by these browser features. Existing local data and production are preserved.

Validation: all five Node suites plus syntax and asset consistency. Browser QA at 390 × 844 verified renamed-byte duplicate detection, linking an existing song to an empty playlist without increasing library count, child challenge wrong/right answers, locking and persistence, song undo restoring membership, playlist recovery after reload, storage figures, current/new version states, local blob playback and no CSP violations. QA uses generated audio, never user songs. Sleep timer excluded.

## Main-page song import — 2026.11.14.2-test

The song import button now appears as a plus next to search in the main library toolbar, including populated playlists. It is no longer inside Settings. Import targets the selected playlist and the shared library, or only the library when All Songs is selected. The child-mode gate protects this entry point and the existing empty-state import action. The manual website-song-refresh button has been removed; application update checks remain separate. No playback-position persistence or other proposed additions were included.

Verified in the 390 × 844 browser preview: absence of both old Settings controls, toolbar chooser opening, a new local song increasing a selected playlist from 1 to 2 and the library from 27 to 28, and a locked child-mode plus opening the adult challenge. All five test suites passed.

## Main-page song editing — 2026.11.14.3-test

Song editing is now a pencil toggle beside import and search in the main toolbar, removed from Settings. Active editing has pressed state, highlighting, and an explicit Finish Editing button. The song count is grouped with the playlist heading on the right; it wraps within that heading group for longer titles. Child mode gates the pencil before enabling edits. Verified at 390 × 844: Settings removal, pencil enabling row edit buttons, opening a song editor, exiting edits, and child-mode protection. All five suites passed.

## Daily-use actions — 2026.11.14.4-test

- Every song has an accessible actions dialog for assignment to a playlist, name/icon editing, selection, library deletion, and removal from the current custom playlist. Adult gating applies to opening these actions.
- Multi-selection can be started from the main list or a song menu. Select All applies to the current filtered results; switching playlists clears selection. Selected songs can be assigned without duplicate memberships or soft-deleted in a single transaction. Undo restores the whole deleted batch atomically and restores each playlist's original order. Individual recovery remains available after restart.
- Duplicate Playlist creates an independent draft with its own ID, the current song selection, appearance and sorting. It writes only when Save is pressed; closing discards the copy.
- Each import batch shows added/duplicate/failure totals and a per-file report, including reused playlist assignments and cancellation. Filenames remain local.
- No playlist photos, playback-position persistence or sleep timer were added.

Validation: six Node suites, including independent copies, idempotent assignments, multi-playlist recovery in differing orders and backup compatibility. Browser checks at 390 × 844 verified song editing through the actions menu, copy independence, assignment of two songs, two-song deletion and full undo, original playlist remaining unchanged, and an import report containing one new song, one renamed duplicate and one unsupported file. Both song menus and multi-selection were blocked by child mode. No CSP violations were observed.

## Song actions visibility — 2026.11.14.5-test

The per-song ellipsis appears only while main-page song editing is active. Finishing edits, entering multi-selection, switching to child lock or reloading returns the song list to its ordinary listening view without these controls.

## Simpler song editing — 2026.11.14.6-test

Per-song ellipsis menus have been removed. In editing mode, each row has a trash icon: custom playlists remove membership only; All Songs moves the track into recoverable deletion. Clicking the song name or animal icon opens name/icon editing. The pencil toggles editing on and off; there is no separate Finish Editing button. Multi-selection remains a main-page control. Deletion notices and the undo bar disappear after five seconds, while recovery remains available in Settings. Local audio captions now say “שמור במכשיר”.

Browser QA at 390 × 844 verified hidden row controls in listening mode, adult gate before editing, row-click editor, pencil exit, playlist-only removal without decreasing library size, library deletion and five-second notices/undo visibility, and later recovery from Settings. All six suites passed.

## Separate editing and playback targets — 2026.11.14.7-test

While editing, song rows use a noninteractive layout container with separate native buttons for the title, animal icon and playback. Only the title/icon buttons open the editor. The caption and row background have no edit/play action. The round play button independently toggles playback without leaving editing mode. Ordinary listening and bulk selection keep their existing row actions. There are no nested buttons. Browser QA verified title and icon editing, inert caption, play/pause while editing, ordinary playback, and bulk selection without starting audio. All six suites passed.

## Sidebar, pinning and membership-only removal — 2026.11.14.8-test

- Playlist choice and pencil are separate accessible sibling buttons inside a single colored, bordered card. The pencil opens editing without selecting that playlist.
- The fixed drawer header includes search, sort, plus and close icons. Search filters playlist names using the existing normalized Hebrew matching; All Songs stays first. Nonempty searches disable ordering.
- The sort icon toggles a draft ordering mode. Arrows and pointer/touch handles reorder within pinned or unpinned groups, never across them. Press the icon again to save; closing the drawer discards an unsaved order. No separate Finish control is added. Child mode protects order changes and discards a draft when relocking.
- Pinning is an optional boolean in playlist metadata, compatible with archives without that field. Pinned playlists form the first stable group after All Songs. Unpinning moves an item to the end of ordinary playlists. Same-group renames keep position. Backup preserves pin flags and array order.
- Within custom playlists, the per-row minus and multi-select Remove From Playlist action change membership only. In All Songs, the trash and batch Delete From Library retain recoverable library deletion.
- Single or batch membership removal offers Undo Removal for five seconds. Undo restores the removed IDs at their original positions without changing library records or other playlists. It skips songs no longer available and does not recreate a deleted playlist.

Validation: seven suites, including stable grouping, pin/unpin placement, cross-group movement rejection, legacy pin compatibility and backup round-trip. Browser QA at 390 × 844 verified integrated pencil, filtering and no-results state, sort disabled during search, pinning, arrow and drag movement, save/reload persistence, closing to cancel, unpin-to-end, nonselecting editor entry, editor without outer overflow, adult gating, contextual batch labels, single/batch removal and exact-order undo, library count and other playlists unchanged.

## Reversible compact player trial — 2026.11.14.9-test

The new compact player is the testing default. Settings → Player Design offers Compact (new) and Classic (previous). The device-local preference lives in meta.playerLayout; it does not increment backup revisions or alter songs, playlists, playback queues or archive format. The existing player DOM and classic CSS remain, with compact-only grid overrides. Switching layouts updates presentation without reloading or resetting audio.

The compact layout has three rows: current song plus icon-only shuffle/repeat, large previous/play/next controls, then seek/time. Existing accessible names and repeat states remain. Full text mode labels return in classic view. Controls use native buttons and SVG transport icons.

Browser QA at 390 × 844 measured compact height 170 px versus classic 220 px; compact play 68 px versus 50 px, and next/previous 54 px. Switching to classic kept audio playing and survived reload; switching back to compact also persisted. Play/pause, next/previous, shuffle and repeat were verified. A 320 × 568 preview had no horizontal player overflow, and repeat-one fits its 44 px control. No changes to production.

## Classic player restored — 2026.11.14.10-test

The compact layout experiment and its Settings selector have been removed. The original classic player is rendered regardless of a previous local layout preference; existing metadata is left untouched. Multi-selection is hidden until editing is active. Selecting songs is a submode of editing: finishing selection returns to editing, while the pencil exits both modes and clears selections. Row editing controls remain separate from the bulk selection targets.

Browser QA at 390 × 844 verified the classic player dimensions (220 px height / 50 px play), no layout selector, bulk control hidden in listening view, adult gate, selection and selection exit, pencil exiting both modes, and ordinary playback. All seven Node suites passed; generated asset consistency was rechecked after final formatting.

## Visible close buttons — 2026.11.14.11-test

Scrollable dialogs now keep their title and close button in an opaque sticky header. This covers Settings, song editing, the parent gate, playlist assignment, deleted items and import results, including when the outer dialog scrolls. The playlist drawer and playlist editor retain their existing fixed headers and separate scrolling lists. Backup confirmation still uses its explicit confirmation/cancel actions.

Browser layout checks at 390 × 844 and 320 × 568 forced long content into each of the six dialogs and verified the close button remained within the visible dialog bounds at the bottom of scrolling. The four required Node suites passed.

## Dialog width and close focus — 2026.11.14.12-test

Removed horizontal negative margins from sticky dialog headers, contained horizontal overflow and enabled wrapping for long text. Header titles can shrink without pushing the close button sideways. Close controls use a filled keyboard-focus state instead of an additional circular outline; focus remains visible for keyboard users.

Browser checks reproduced 2 px of horizontal overflow in Settings before the change. Afterwards all six scrollable dialogs had scrollWidth equal to clientWidth at both 320 × 568 and 390 × 844, and all close buttons stayed visible at scroll end. Keyboard Tab/Shift+Tab verified focus-visible, changed background and no outline. The four required suites passed.

## Song editor save feedback and fixed dialog frames — 2026.11.14.13-test

The six scrollable dialogs now have a non-scrolling header and a separate vertically scrolling body, replacing sticky headers inside the scroll area. The dialog itself clips overflow and the body wraps long text, contains overscroll and permits vertical touch scrolling and pinch zoom. This addresses Safari/RTL horizontal movement reports without disabling page zoom.

Song editing now captures ID, title, selected icon and playlist membership synchronously on submission, using the selected icon state as the source of truth. Native form validation is replaced with explicit name/icon validation and visible inline status/errors; failed writes can be retried without closing the editor. The original reported iPhone failure was not reproduced in desktop Chromium, so the exact original cause remains unconfirmed.

Browser checks at 320 × 568 and 390 × 844 verified no horizontal overflow and close buttons visible while scrolling the body. UI checks saved name plus two successive icon choices, reopened and saved another icon without exiting edit mode, showed a validation error for an empty name, corrected it in the same window, saved a custom emoji and verified persistence after reload. A regression suite covers repeated saves, preserving audio/fingerprint data, failure/retry, validation and field changes during an asynchronous read. All eight Node suites passed. Real-device Safari confirmation remains needed.

## Metadata-only song editing — 2026.11.14.14-test

Song edits now persist a small songEdit:<id> metadata record together with playlist membership and backup revision, without reserializing the stored audio Blob. Reload projects those title/icon overrides onto track records; backup preparation already uses these projected records. Restoring an archive clears overrides only for incoming track IDs in the same transaction so archive titles/icons win. Existing records need no migration. The older raw track metadata remains readable but versions before this change do not project new overrides.

The song edit window closes immediately after the metadata write commits. A subsequent refresh failure is reported separately from a save failure. The original device error is still not identified; reducing the write to metadata addresses a possible Blob-writing failure path without claiming a confirmed Safari cause.

All eight suites passed, including metadata-only writes, override projection, null override reset, repeated saves and retry after failure. Browser QA changed name/icon, confirmed immediate closure, reopened and changed the icon again without leaving editing, inspected the synthetic QA database to confirm audio record unchanged and metadata updated, and verified the saved title/icon after reload. Real-device confirmation is still needed.

## Explicit audio source switching — 2026.11.14.15-test

Every transition to a different song now pauses and detaches the previous source, explicitly loads the empty media element to discard its old buffer, then revokes the old object URL. The selected source is assigned and explicitly loaded before play. Same-song pause/resume retains its position. Stale play promises cannot reset a newer selection; an unavailable/offline selection stops the old song instead of leaving it audible. Service-worker behavior is unchanged: audio blobs and audio file requests are not shell-cache entries.

The reported post-update iPhone problem was not reproduced directly, so this is a targeted source-switching fix rather than a confirmed diagnosis of corrupted stored audio. No library data is modified.

A new regression suite covers different Blob bytes, explicit media buffer reload, URL disposal order, pause/resume, stale rejected promises after rapid changes, offline selection and reset. Required suites and song-edit/safeguards checks passed. Browser QA used three distinct generated tones: selected track ID/title and fetched currentSrc SHA-256 matched the corresponding stored Blob, including rapid transitions and a fresh page reload. Safari/device verification remains needed.

## Read-only on-device audio diagnostics — 2026.11.14.16-test

The reported issue persists on the user's iPhone: song title changes but audible content does not. No further speculative playback changes in this version. Settings now offers an explicit local audio diagnosis with a fixed-header result dialog and copy-report action. It hashes stored and in-memory bytes per visible track, compares import fingerprints when available, identifies identical byte content across names, and compares the active Blob source with the selected track. Missing legacy fingerprints and source changes during a scan are reported explicitly. It reads local data only and never repairs, overwrites or deletes songs. CSP connect-src now explicitly permits blob: for reading the active local resource; network hosts remain self-only.

Node diagnostics tests inject matching/mismatched playback content, changed stored bytes and duplicate records, and assert no library writes. Required suites plus song-edit/playback/safeguards passed. Browser QA with generated local tones and known duplicate fixtures produced correct storage/memory and active-source comparisons; CSP permission for the Blob fetch was verified. The root cause and repair await the affected device's report.

## Byte-backed audio records and strict read verification — 2026.11.14.17-test

The affected device report showed five different declared file sizes but identical complete hash groups. This establishes that reads returned identical content across those records; it does not establish whether the underlying original files are permanently damaged. Playback UI selection and active-source hashes agreed, so source-switching alone cannot recover the correct per-song content.

All future track writes pre-materialize audio into ArrayBuffers, verify read length and the expected checksum if available, and persist audioBytes/audioType rather than Blob/File handles. Reading these records creates fresh playback Blobs from bytes. Existing legacy Blob records remain readable and are not migrated by startup. Any batch with mismatched length/hash is rejected before opening its write transaction. Restore retains archive checksums on tracks, so restored content has an expected fingerprint. Backup creation now rejects size/read discrepancies and checksum mismatches instead of blessing the returned bytes. The portable archive format and database name/version remain unchanged; older app versions cannot play new byte-backed records without updating.

Ten existing suites plus new audio-storage regression passed. Storage tests cover structured-clone reload, distinct content, legacy compatibility, portable backup/restore and retained checksums, forged size/read aliases, and rejecting a bad batch before any transaction. Browser QA restored three synthetic tones through the actual restore handler, confirmed stored records had ArrayBuffers and no Blob fields with valid separate hashes, reloaded the page, and verified all three selected playback sources against their expected bytes. No personal audio was used or published.

The user must restore from their previously known-good archive (or original files) after updating, because the current legacy records cannot safely be auto-converted based on this report. Do not replace that archive with a backup made while reads are affected. Real-device verification remains required.

Audio-only repair: Settings → Fix audio from a known-good backup uses a separate file input and explicit confirmation. Only matching active track IDs receive archive audio and checksums; current names/icons/order, song edit overrides and playlist metadata remain intact. Hidden and unmatched tracks are untouched. No matching IDs or any invalid archive causes no write. The batch is validated/materialized before a single atomic transaction. Browser QA renamed a track and changed its icon, repaired from the original three-tone archive through the actual handler, reloaded, and verified the new name/icon remained while raw stored bytes/checksums were correct and no Blob handles were stored. Prefer this targeted repair to full restore when the user has changed metadata since the archive.

## Delete/undo/order without audio reads — 2026.11.14.18-test

The user's screenshot confirmed that v17's generic audio-write validation also blocked deletion of unreadable legacy records. Soft deletion, undo/recovery and manual library ordering now persist small trackState metadata patches atomically with playlist/trash changes. Track reads project those patches and song edits without reading audio bytes. Existing bytes are retained for recovery; metadata changes no longer reserialize them. Full archive restore clears state overrides for incoming IDs, and permanent purge clears obsolete overrides.

Import duplicate checking skips legacy candidates whose bytes cannot be read or do not match their expected fingerprint. Unreadable active/trash records therefore cannot block a fresh original file upload. Checking a legacy fingerprint no longer rewrites its audio. Valid byte-backed duplicate detection remains active.

The regression suite executes actual batch deletion against records whose audio reads throw, verifies deletion and membership/trash state, recovery/order and retained song edits without audio reads, and executes the import candidate loop to verify unreadable-trash skipping and valid duplicate matching. Required suites plus song-edit, audio-storage, diagnostics and safeguards passed. Production remains untouched.

## Settings dialog height — 2026.11.15.1-test

A production iPhone screenshot showed Settings collapsed to the title and a sliver of body content. The internally scrolling frame previously had only max-height and flex children with zero flex basis, leaving its actual height dependent on intrinsic layout. Settings now has an explicit viewport-bounded height (85vh fallback, min(760px,85dvh)); framed form/body children use an automatic flex basis so short dialogs retain their natural content size. Header/X remain outside the vertical scroll area. No data or playback logic changes.

Required archive/assets/staging/playlists suites and JS syntax checks passed. The attempted local browser QA was unavailable due to a browser URL-policy block after an initial refused local connection; no successful visual verification is claimed. Device confirmation is required before production promotion. Production remains 2026.11.14.1.
