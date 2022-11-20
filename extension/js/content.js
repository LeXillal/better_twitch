log("Initialisation...");

// Fonction pour affihcer des logs avec [ Better Twitch ] avant
function log(message) {
	console.log("[ Better Twitch ] ", message);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function getOnlineStreams() {
	return Array.from(document.querySelectorAll(".jKBAWW")).filter(stream => !Boolean(stream.querySelector(".side-nav-card__avatar--offline")));
}

const handledStreams = [];

function handleHover(stream) {

	let elementCenter = stream.querySelector('img').getBoundingClientRect();
	elementCenter = elementCenter.top - elementCenter.height / 2;

	let top = elementCenter - 281 / 2;
	top = top < 55 ? 55 : top; // Si trop haut
	top = top > window.innerHeight - 281 - 5 ? window.innerHeight - 281 - 5 : top; // Si trop bas

	// On crée un div
	const preview = document.createElement("div");
	// On lui donne la classe preview
	preview.classList.add("preview");
	preview.style.top = `${top}px`;

	//Fonction pour faire apparaître le stream
	const linkStream = stream.getAttribute("href").replace("/", "");
	const previewLink = `https://player.twitch.tv/?channel=${linkStream}&muted=true&parent=twitch.tv&player=popout`

	// On creer un iframe
	const iframe = document.createElement("iframe");
	// On met le lien de la preview dans l'iframe
	iframe.src = previewLink;
	// On ajoute le iframe dans le div
	preview.appendChild(iframe);

	// On attend un peut pour être sur le bouf veut voir la preview
	const timeoutShow = setTimeout(() => {
		// On ajoute le div dans le document
		document.body.appendChild(preview);

		log("Apparition du stream " + linkStream);
	}, 500);

	stream.addEventListener("mouseleave", () => {
		clearTimeout(timeoutShow);

		const timeoutLeave = setTimeout(() => {
			preview.remove();
		}, 500);

		// On fait en sorte qu'on puisse aller sur la preview
		preview.addEventListener("mouseenter", () => {
			clearTimeout(timeoutLeave);
			preview.addEventListener("mouseleave", () => {
				preview.remove();
			});
		});
		// On delete la preview
	})

}

async function main() {
	const Streams = getOnlineStreams();
	log(Streams);

	for (const stream of Streams) {
		if (handledStreams.includes(stream)) continue;
		stream.addEventListener("mouseenter", (e) => {
			e.preventDefault();
			handleHover(stream);
		});
		handledStreams.push(stream);
	};
}

setTimeout(() => {
	main();
	setInterval(main, 5000);
}, 2000);