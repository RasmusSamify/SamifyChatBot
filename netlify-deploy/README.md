# Samify Widget

## Deploy till Netlify
1. Pusha hela denna mapp till ett GitHub-repo
2. Koppla repot i Netlify (New site from Git)
3. Build command: *(lämna tomt)*
4. Publish directory: `.` (root)
5. Deploy!

## Embedkod för kunder
När sidan är live, klistra in denna rad precis innan `</body>` på kundens hemsida:

```html
<script src="https://DITT-NAMN.netlify.app/widget.js"></script>
```

Byt ut `DITT-NAMN` mot din Netlify-subdomän.

## Uppdatera widgeten
Gör ändringar i `widget.js` → pusha till GitHub → Netlify deployas automatiskt.
Kundens embedkod behöver **aldrig** ändras.

## Byt Calendly-länk
Hitta raden i widget.js:
```js
const CALENDLY_URL = 'https://calendly.com/samify';
```
Byt ut mot er riktiga länk.
