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
