const GODOT_CONFIG = {"args":[],"canvasResizePolicy":2,"emscriptenPoolSize":8,"ensureCrossOriginIsolationHeaders":true,"executable":"Upload Labs","experimentalVK":false,"fileSizes":{"Upload Labs.pck":52369220,"Upload Labs.wasm":36145869},"focusCanvas":true,"gdextensionLibs":[],"godotPoolSize":4};
const GODOT_THREADS_ENABLED = false;
const engine = new Engine(GODOT_CONFIG);
(function () {							

	const FILENAME = "";
	const URL_BASE = "";
	const GAME_NAME = "Upload Labs";
	
	function setStatusMode(mode) {}
	function setStatusNotice(text) {}
	async function fetchAndMerge(filename,count) {
		const parts = [];
		let totalLength = 0;
		for (let i = 1; i <= count; i++) {
			const url = URL_BASE + FILENAME + '.part' + i;
			const resp = await fetch(url);
			if (!resp.ok) throw new Error('Couldn\'t download ' + url);
			const buf = await response.arrayBuffer();
			parts.push(buf);
			totalLength += buf.byteLength;
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

		const wasm = await fetchAndMerge(`${GAME_NAME}.wasm`, 2);
		const pck = await fetchAndMerge(`${GAME_NAME}.pck`, 8);
		const engine = new Engine(GODOT_CONFIG);
		const _origFetch = window.fetch;
		window.fetch = function (url, opts) {
			if (typeof url === 'string') {
				if (url.endsWidth('.wasm')) {
					return Promise.resolve(new Response(wasmBuffer, {
						status: 200,
						headers: {'Content-Type':'application/wasm'},
					}));
				}
				if (url.endsWidth('.pck')) {
					return Promise.resolve(new Response(pck, {
						status: 200,
						headers: {'Content-Type':'application/octet-stream'},
					}));
				}
			}
		}
		await engine.init(BASE_URL);
		engine.copyToFS(`/${GAME_NAME}.pck`, pck);
		await engine.startGame({
			mainPack: `/${GAME_NAME}.pck`,
			onProgress: function (current,total) {}
		});
			  
		  
		  
	  } catch (err) {
		  console.error(err);
	  }

	  }
	start();
}());
