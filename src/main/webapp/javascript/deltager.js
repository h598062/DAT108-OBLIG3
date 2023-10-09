class DeltagerManager {
	#regElm;
	#statElm;
	#finndeltagerElm;
	// Deklarer resterende felt-variabler her
	#deltagere = [];

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
	}

	#finndeltager() {
		// Fyll inn kode
	}

	#beregnstatistikk() {
		// Fyll inn kode
	}

	#registrerdeltager() {
		const tidReg = /(?:\d{0,2}:){2}\d{0,2}/g;
		const startnummerReg = /\d{1,3}/g;
		const navnReg = /\p{L}{2,}(?:-\p{L}{2,})?/gu;

		// Fyll inn kode
		const inputElm = this.#regElm.getElementsByTagName("input")[0];
		const deltagerString = inputElm.value;

		const nyDeltager = {};

		// navn håndtering
		// vil lage en liste med navn som case-fikses
		const navn = deltagerString
			.match(navnReg)
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

		// tid håndtering
		const tidStr = deltagerString
			.match(tidReg)[0]
			.split(":") // splitt opp tid ved :
			.map((s) => (s = s.padStart(2, "0"))) // fyll på med nuller der tall mangler
			.join(":"); // slå sammen tid igjen til en enkeltstreng
		nyDeltager["tid"] = tidStr;
		const deltagerStringUT = deltagerString.replace(tidReg, " "); // fjern tid fra input string sånn at startnummer kan håndteres

		// nummer håndtering
		const nummer = deltagerStringUT.match(startnummerReg)[0];
		nyDeltager["startnummer"] = parseInt(nummer);

		// tøm input felt når vi er ferdig for å gjøre klar for nyinnskriving
		// TODO: Denne skal kun tømme hvis insetting var suksessfull
		inputElm.value = "";
		console.log(nyDeltager);
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
