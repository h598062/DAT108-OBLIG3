/// <reference path="../index.html" />
class DeltagerManager {
	#regElm;
	#statElm;
	#finndeltagerElm;
	// Deklarer resterende felt-variabler her
	#deltagere;

	/**
	 * @param {HTMLElement} root
	 */
	constructor(root) {
		this.#regElm = root.getElementsByClassName("registrering")[0];

		const regButton = this.#regElm.getElementsByTagName("button")[0];
		regButton.addEventListener("click", () => {
			this.#registrerdeltager();
		});

		this.#statElm = root.getElementsByClassName("statistikk")[0];
		const statButton = this.#statElm.getElementsByTagName("button")[0];
		statButton.addEventListener("click", () => {
			this.#beregnstatistikk();
		});

		this.#finndeltagerElm = root.getElementsByClassName("deltager")[0];
		const deltagerButton = this.#finndeltagerElm.getElementsByTagName("button")[0];
		deltagerButton.addEventListener("click", () => {
			this.#finndeltager();
		});

		// Fyll evt. inn mer kode
		this.#deltagere = [];
	}

	#finndeltager() {
		const inputElm = this.#finndeltagerElm.getElementsByTagName("input")[0];
		const tall = inputElm.value;
		const treff = this.#deltagere.find((d) => d.startnummer === parseInt(tall));
		const resultatOkElm = this.#finndeltagerElm.getElementsByClassName("resultatok")[0];
		const resultatManglerElm = this.#finndeltagerElm.getElementsByClassName("resultatmangler")[0];
		if (treff != undefined || treff != null) {
			resultatOkElm.classList.remove("hidden");
			const resultattekst = resultatOkElm.getElementsByTagName("dd");
			resultattekst[0].textContent = treff.startnummer;
			resultattekst[1].textContent = treff.navn;
			resultattekst[2].textContent = treff.tid;
			resultatManglerElm.classList.add("hidden");
			inputElm.setCustomValidity("");
		} else {
			resultatOkElm.classList.add("hidden");
			resultatManglerElm.classList.remove("hidden");
			inputElm.setCustomValidity(`Fant ikke deltager med startnummer ${tall}`);
		}
		inputElm.reportValidity();
	}

	#beregnstatistikk() {
		// Fyll inn kode
	}

	#registrerdeltager() {
		// timer:minutt:sekunder
		const tidReg = /(?:\d{0,2}:){2}\d{0,2}/g;
		const startnummerReg = /\d{1,3}/g;
		const navnReg = /\p{L}{2,}(?:-\p{L}{2,})?/gu;

		// Fyll inn kode
		const inputElm = this.#regElm.getElementsByTagName("input")[0];
		const deltagerString = inputElm.value;

		const nyDeltager = {};

		let errored = false;

		// TODO: valider om input inneholder ulovlige tegn, f.eks. kun (A-Å a-å 0-9 :) er gyldig

		// navn håndtering
		// vil lage en liste med navn som case-fikses
		try {
			const navnArr = deltagerString.match(navnReg);
			if (navnArr == null || navnArr.length < 1) {
				throw new Error("Navn må være på minst 2 bokstaver");
			} else if (navnArr.length < 2) {
				throw new Error("Deltageren må ha både fornavn og etternavn");
			}
			const navn = navnArr
				.map(
					(s) =>
						(s = s
							.toLowerCase() // gjør alle bokstaver til lowercase
							.split("-") // splitt opp alle bindestrek-navn i nye enkeltstrenger
							.map((x) => x[0].toUpperCase() + x.substring(1)) // sett første bokstav i hver streng til stor bokstav
							.join("-")) // slå sammen bindestrek-navn igjen
				)
				.join(" "); // tar alle navn i navneliste og slår dem sammen til en enkelt string med mellomrom mellom
			nyDeltager["navn"] = navn;
		} catch (e) {
			console.error(e);
			inputElm.setCustomValidity(e.message);
			errored = true;
		}

		// tid håndtering
		try {
			const tidArr = deltagerString.match(tidReg);
			if (tidArr == null || tidArr.length < 1) {
				throw new Error("Deltakeren mangler en sluttid");
			} else if (tidArr.length > 1) {
				throw new Error("Angi kun ett sluttidspunkt");
			}
			const tid = tidArr[0]
				.split(":") // splitt opp tid ved :
				.map((s) => (s = s.padStart(2, "0"))); // fyll på med nuller der tall mangler
			if (tid.map((s) => parseInt(s)).reduce((acc, val) => acc + val, 0) < 1) {
				throw new Error("Tiden må være på minst 1 sekund");
			}
			const tidStr = tid.join(":"); // slå sammen tid igjen til en enkeltstreng
			nyDeltager["tid"] = tidStr;
		} catch (e) {
			console.error(e);
			inputElm.setCustomValidity(e.message);
			errored = true;
		}
		const deltagerStringUT = deltagerString.replace(tidReg, " "); // fjern tid fra input string sånn at startnummer kan håndteres

		// nummer håndtering
		try {
			const nrArr = deltagerStringUT.match(startnummerReg);
			if (nrArr == null || nrArr.length < 1) {
				throw new Error("Deltakeren mangler et startnummer");
			} else if (nrArr.length > 1) {
				throw new Error("Angi kun ett startnummer");
			}
			const startnummer = parseInt(nrArr[0]);
			if (startnummer < 1) throw new Error("Startnummer er mindre enn 1");
			if (this.#erStartNummerIBruk(startnummer)) {
				throw new Error(`Startnummer ${startnummer} er allerede i bruk`);
			}
			nyDeltager["startnummer"] = startnummer;
		} catch (e) {
			console.error(e);
			inputElm.setCustomValidity(e.message);
			errored = true;
		}

		// sjekk om feil i deltaker
		console.log(nyDeltager);
		if (!errored) {
			// tøm input felt når vi er ferdig for å gjøre klar for nyinnskriving
			this.#deltagere.push(nyDeltager);
			inputElm.value = "";
			inputElm.setCustomValidity("");
			console.log("Ny deltager lagt til");
			if (this.#erNyBestetid(nyDeltager.tid)) {
				const resultatElm = this.#regElm.getElementsByClassName("resultat")[0];
				resultatElm.classList.remove("hidden");
				resultatElm.getElementsByTagName("span")[0].textContent = nyDeltager.tid;
			}
		}
		inputElm.reportValidity();
	}

	// Fyll inn evt. hjelpemetoder
	/**
	 * Hjelpemetode for testing av kode
	 * @param {string[]} args
	 */
	testRegistrer(...args) {
		for (const arg of args) {
			this.#regElm.getElementsByTagName("input")[0].value = arg;
			this.#registrerdeltager();
		}
	}

	/**
	 * Sjekker om en gitt tid er den nye bestetiden
	 * @param {string} tid
	 * @returns {boolean} true hvis den gitte tiden er den minste
	 */
	#erNyBestetid(tid) {
		const tider = this.#deltagere.map((d) => this.#parseTidTilSek(d.tid));
		return tider.filter((t) => t < this.#parseTidTilSek(tid)).length < 1;
	}

	/**
	 * Gjør om en "hh:mm:ss" formatert tidstreng til antall sekunder
	 * @param {string} tidStr
	 * @returns {number} tidstreng gjort om til sekunder
	 */
	#parseTidTilSek(tidStr) {
		const tidArr = tidStr.split(":").map((s) => parseInt(s));
		return tidArr[0] * 3600 + tidArr[1] * 60 + tidArr[2];
	}

	/**
	 * Sjekker om et gitt startnummer er allerede i bruk
	 * @param {number} nr
	 * @returns {boolean} true hvis nummeret er i bruk
	 */
	#erStartNummerIBruk(nr) {
		const numre = this.#deltagere.map((d) => d.startnummer);
		return numre.includes(nr);
	}
}

const rootelement = document.getElementById("root");
const dm = new DeltagerManager(rootelement);
// test registrering av eksempler on page load for å sjappere sjekke endringer
dm.testRegistrer(
	"Ole 01 atle-johan 1:34:22 pEdersen",
	"107 2:02:21 anne Annesen",
	"::33 hanne-anne 13 peder-ole",
	"Mette :47: Mettesen 2"
);
