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
