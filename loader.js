const GODOT_CONFIG = {"args":[],"canvasResizePolicy":2,"emscriptenPoolSize":8,"ensureCrossOriginIsolationHeaders":true,"executable":"Upload Labs","experimentalVK":false,"fileSizes":{"Upload Labs.pck":52369220,"Upload Labs.wasm":36145869},"focusCanvas":true,"gdextensionLibs":[],"godotPoolSize":4};
const GODOT_THREADS_ENABLED = false;
const engine = new Engine(GODOT_CONFIG);
(function () {							

	const FILENAME = "";
	const URL_BASE = "https://cdn.jsdelivr.net/gh/thepwds/ulwebport/";
	const GAME_NAME = "Upload Labs";
	
	function setStatusMode(mode) {}
	function setStatusNotice(text) {}
	async function fetchAndMerge(filename,count) {
		const parts = [];
		let totalLength = 0;
		for (let i = 1; i <= count; i++) {
			const url = URL_BASE + filename + '.part' + i;
			const resp = await fetch(url);
			if (!resp.ok) throw new Error('Couldn\'t download ' + url);
			const buf = await resp.arrayBuffer();
			parts.push(buf);
			totalLength += buf.byteLength;
			console.log("Download goes brrrr");
		}
		const merged = new Uint8Array(totalLength);
		let offset = 0;
		for (const part of parts) {
			merged.set(new Uint8Array(part), offset);
			offset += part.byteLength;
		}
		return merged.buffer;
	}
	async function start() {
	  try {

		const wasm = await fetchAndMerge(`Upload Labs.wasm`, 9);
		const pck = await fetchAndMerge(`Upload Labs.pck`, 13);
		const engine = new Engine(GODOT_CONFIG);
		const _origFetch = window.fetch;
		window.fetch = function (url, opts) {
			if (typeof url === 'string') {
				if (url.endsWith('.wasm')) {
					return Promise.resolve(new Response(wasm, {
						status: 200,
						headers: {'Content-Type':'application/wasm'},
					}));
				}
				if (url.endsWith('.pck')) {
					return Promise.resolve(new Response(pck, {
						status: 200,
						headers: {'Content-Type':'application/octet-stream'},
					}));
				}
			}
		}
		await engine.init(URL_BASE);
		engine.copyToFS(`/Upload Labs.pck`, pck);
		await engine.startGame({
			mainPack: `/Upload Labs.pck`,
			onProgress: function (current,total) {}
		});
			  
		  
		  
	  } Catch (err) {
		  console.error(err);
	  }

	  }
	start();
}());
