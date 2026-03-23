# Protocol: Veilige Google Sheets & Athena CMS Verbinding (v1.0)

Dit protocol beschrijft de standaardwerkwijze voor het koppelen van Google Sheets aan de Athena CMS Factory, met speciale aandacht voor het omzeilen van de "Onveilig/Geavanceerd" waarschuwingen voor de eindklant.

## 🎯 Doelstelling
De klant voorzien van een werkend CMS zonder dat zij zelf technische autorisatie-stappen ("Geavanceerd" -> "Ga door") hoeven uit te voeren in Google Apps Script.

---

## 🏗️ De Strategie: De "Pre-Authorized Project Account"
In plaats van de klant het script te laten autoriseren in hun persoonlijke Gmail-account, maken we een specifiek project-account aan (bijv. `cms.bedrijfsnaam@gmail.com`). Wij autoriseren het script éénmalig, waarna de klant het account overneemt.

### Fase 1: Voorbereiding (Ontwikkelaar)
1.  **Account aanmaken:** Maak een nieuw Google-account aan specifiek voor de klant.
2.  **Sheet opzetten:** Kopieer de Athena Master Sheet naar dit account.
3.  **Scripts installeren:**
    *   Open de Sheet -> Extensies -> Apps Script.
    *   Plak de inhoud van `@factory/5-engine/GS-ClientDeployer.gs`.
    *   Sla op en geef het project de naam: `Athena CMS Connector`.

### Fase 2: De "Pre-Clearance" (Ontwikkelaar)
Dit is de stap waarbij jij de waarschuwingen wegwerkt:
1.  Klik in de Google Sheet op het menu **🚀 Athena CMS** -> **Website Live Zetten**.
2.  Er verschijnt een pop-up: "Autorisatie vereist". Klik op **OK**.
3.  Kies het nieuwe project-account.
4.  **Het kritieke punt:** Google toont "Deze app is niet geverifieerd".
    *   Klik op de link **Geavanceerd** (links onderaan).
    *   Klik op **Ga naar Athena CMS Connector (onveilig)**.
5.  Klik op **Toestaan**.
6.  *Resultaat:* De koppeling is nu voor dit account permanent goedgekeurd.

### Fase 3: Beveiliging & Overdracht
Omdat Google inlogpogingen vanaf een nieuwe locatie (de klant) vaak blokkeert, nemen we deze maatregelen:
1.  Ga naar [myaccount.google.com/security](https://myaccount.google.com/security).
2.  Activeer **2-Staps-Verificatie**.
3.  Genereer **Back-upcodes** (een lijst van 10 eenmalige codes).
4.  **Overdrachtsdossier opstellen:**
    *   E-mailadres & Wachtwoord.
    *   De lijst met Back-upcodes.
    *   Instructie: "Log in en voeg uw eigen telefoonnummer toe voor herstel."

---

## 🛡️ Fase 4: De Veiligheidslaag (Configuratie-Integriteit)
Omdat Google Sheets bewerkers toestaat om tabbladen weer zichtbaar te maken, implementeren we een dubbele beveiliging voor technische tabbladen (beginnend met `_`).

### 1. Harde Schrijfbeveiliging
1.  Klik met de rechtermuisknop op elk technisch tabblad (bijv. `_style_config`, `_links_config`).
2.  Kies **Blad beveiligen**.
3.  Klik op **Machtigingen instellen**.
4.  Kies **Beperken wie dit bereik kan bewerken** en selecteer **Alleen jij**.
*Dit zorgt ervoor dat de klant de data wel kan zien (indien zichtbaar gemaakt), maar NOOIT kan wijzigen.*

**💡 Visuele Afschrikking (Extra Veiligheid):**
*   **Actie:** Zet in cel **A1** van elk technisch tabblad een grote waarschuwing in witte tekst op een felrode achtergrond: 
    > `⚠️ SYSTEEMCONFIGURATIE - NIET WIJZIGEN. DIT KAN UW WEBSITE BREAKEN.`
*   **Extra:** Maak de kolommen A t/m Z in die tabbladen heel smal of verberg de ongebruikte kolommen, zodat de data minder "uitnodigend" is om in te neuzen.

### 2. De "Auto-Hide" Safety Switch
In het script `@factory/5-engine/GS-ClientDeployer.gs` is een functie opgenomen die technische tabbladen automatisch verbergt bij het openen van de Sheet. Mocht de klant een tabblad zichtbaar maken, dan zal dit bij de volgende sessie automatisch weer worden opgeruimd.

---

## 📝 Communicatie naar de Klant (Update)
Voeg dit toe aan de uitleg:
> *"Sommige onderdelen van de beheertool zijn vergrendeld om de stabiliteit van uw website te garanderen. Deze technische instellingen worden automatisch beheerd door de Athena Engine. U kunt zich volledig concentreren op de inhoud in de overige tabbladen."*

---

## 📝 Communicatie naar de Klant
Gebruik de volgende tekst in je begeleidende brief om professionaliteit uit te stralen:

> *"Om uw privacy en de veiligheid van uw data te garanderen, heb ik voor uw website een eigen beveiligde 'Project Connector' opgezet. Ik heb dit systeem reeds technisch geconfigureerd en gecertificeerd voor gebruik. U ontvangt hierbij de inloggegevens van dit account. Zodra u inlogt, kunt u direct gebruikmaken van de CMS-functies zonder extra technische installatie."*

---

## ❓ Veelgestelde Vragen (Interne FAQ)

**V: Waarom geeft Google de melding "Onveilig"?**
A: Google classificeert elk script dat niet door hun eigen personeel is gereviewd (een proces dat duizenden euro's kost) als 'untrusted'. Voor interne bedrijfssoftware zoals Athena CMS is de handmatige "Geavanceerd" autorisatie de standaard en veilige procedure.

**V: Wat als de klant toch hun eigen privé-mail wil gebruiken?**
A: Dan moeten zij de "Geavanceerd"-stappen zelf doorlopen. Stuur hen in dat geval een korte video-instructie (screencast) van 15 seconden om hen door de pop-ups te gidsen.

**V: Kan ik de verbinding testen zonder build-credits te verbruiken?**
A: Ja. Gebruik de functie `Afbeeldingen Manager` in het menu. Als de uploader opent en geen autorisatie-fout geeft, is de verbinding correct opgezet.

---
*Gegenereerd door Gemini CLI (Maart 2026) voor Athena CMS Factory v8.1*
