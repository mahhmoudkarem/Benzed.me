# Benzed — Lagoon palette + new typography

كل الألوان والخطوط بقت في مكان واحد: `src/styles.css` (قسم THEME TOKENS و TYPOGRAPHY).
عشان تغيّر أي لون في الموقع كله، غيّره هناك بس.

## الألوان
| الدور | Dark | Light |
|---|---|---|
| الخلفية | #0B1719 | #EAF1EF |
| الكروت | #112124 | #FAFCFB |
| النص | #E6EEEC | #0A2125 |
| Accent (أزرار/لينكات) | #5BC4BD | #0B5C66 (لون اللوجو) |
| Sea-glass (ثانوي) | #8FDCC4 | #136B5C |
| Saffron (لمسة دافية، بالقليل) | #F5B83D | #A96F00 |
| Dusty blue (نادر) | #7FA6E8 | #3F5FA8 |

- `--on-accent` = لون النص فوق أي زرار/خلفية accent (غامق في الدارك، أبيض في اللايت).
- القديم كان أحمر #F20D18 + بينك + برتقالي، ونص أبيض صريح #FFF على #0D0D0B (تباين 19.5:1 بيعمل وهج).

## الخطوط
- الجسم (عربي + إنجليزي): **Readex Pro**
- العناوين الإنجليزي: **Bricolage Grotesque** — العناوين العربي بتفضل Readex Pro
- الأوزان 900/950 اتحوّلت لـ 800، والـ letter-spacing السالب اتخفف.

## ملفات اتعدلت
styles.css, index.html, theme.ts (theme-color), work.ts (ألوان المشاريع), وكل ملفات الـ CSS في Pages و Layout.
