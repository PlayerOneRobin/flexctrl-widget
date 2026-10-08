# FLEX/CTRL Mini — PWA med Windows 11-widget (testprojekt)

Detta är ett startprojekt, **inte en färdig `.msix`-installation**. Jag har inte kunnat testa widgetens registrering i Windows 11 från Linux. HTML-kalkylatorn fungerar även om widget-API:t inte stöds.

## 1. Publicera projektet via HTTPS

1. Skapa ett nytt **public** GitHub-repo, t.ex. `flexctrl-widget`.
2. Ladda upp **innehållet** i den här mappen till repots rot (`index.html`, `manifest.webmanifest`, `sw.js`, `widgets/`, `icons/` osv.).
3. Gå till **Settings → Pages** i GitHub, välj **Deploy from a branch**, `main`, `/ (root)` och spara.
4. Öppna URL:en som GitHub Pages ger dig: `https://DITT-NAMN.github.io/flexctrl-widget/`.

OBS: Då publiceras koden och webbappen offentligt. Arbetsstarttiden sparas fortfarande lokalt i din webbläsare, inte på GitHub.

## 2. Installera webbappen

1. Öppna HTTPS-adressen i **Microsoft Edge** i Windows 11.
2. Välj **… → Appar → Installera denna webbplats som en app** (menyn kan heta något liknande).
3. Aktivera **Utvecklarläge** i Windows-inställningarna om widgeten kräver det vid test. Se Microsofts officiella PWA-widgetguide.
4. Tryck `Win + W`, välj **Lägg till widgetar** och leta efter **FLEX/CTRL Mini**.
5. Prova knapparna **−5 min / Start nu / +5 min** direkt på widgeten.

Om appen går att installera men widgeten inte syns: kontrollera att Edge och Windows 11 är uppdaterade och att PWA-widgets stöds/är aktiverade i din Windows-version. Öppna webbläsarens F12 Developer Tools och kontrollera service worker-fel i Console/Application. Detta projekt är inte Windows-testat.

## 3. Vad den kan göra

- Widget: visa starttid, beräknad sluttid och ändra starttid med +/− 5 min eller `Start nu`.
- Installerad PWA: skriv valfri starttid `HH:MM` i den mörka HTML-kalkylatorn.
- Uträkning: 8 timmar + 40 minuter = 520 minuter. 07:30 → 16:10.
- Lokal state: delas mellan PWA-sidan och service workern med Cache Storage. Inget konto eller backend krävs.

## 4. Begränsningar

- PWA-widgeten använder **Adaptive Cards**, inte samma HTML/CSS som den installerade PWA-appen. Knapparnas exakta utseende styrs delvis av Windows.
- Fritt textfält **inne i widgeten** ingår inte. För identisk HTML-interaktion i widgetpanelen finns Microsofts nyare **web widget providers**, som kräver en paketerad widget-provider-app och en publicerad innehålls-URL.
- Widgetens tillgänglighet kan variera med version och policy. Registrering har inte verifierats på en riktig Windows 11-dator.
- `.hta` används inte av detta projekt.

## Officiella guider

- PWA-widgets: https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/widgets
- Win32/C# widget providers: https://learn.microsoft.com/en-us/windows/apps/develop/widgets/implement-widget-provider-cs
- Web widget providers: https://learn.microsoft.com/en-us/windows/apps/develop/widgets/web-widget-providers
