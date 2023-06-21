import {computed, ref} from "vue";
import browser from "webextension-polyfill";

/**
 * Returns a reactive reference to Chrome extension storage
 * @param {String} path - The fullstop-seperated path for the value to be stored, e.g `foo.bar.baz` is `foo:{bar:{baz:<value>>}}`
 * @param {*} defaultV - The default for the value
 */
export function useExtensionStorage(path, defaultV) {
    // The value that's being stored
    const storage = ref(defaultV)
    // Check for when the actual storage changes, and update the ref
    browser.storage.local.onChanged.addListener((changes) => {
        const p = path.split(".");
        const change = changes[p[0]];

        if (change) {
            storage.value = stringPath(change.newValue, p.slice(1).join("."));
        }
    })
    // Get the value from storage initially
    browser.storage.local.get().then(data => {
        storage.value = stringPath(data, path);
    })
    // Return a computed property that updates storage and returns the value
    return computed({
        get() {
            return storage.value;
        },
        set(value) {
            browser.storage.local.get().then(data => {
                let out = data;
                const layers = path.split(".");
                for (const layer of layers.slice(0, -1)) {
                    out = out[layer];
                }
                out[layers[layers.length - 1]] = value;
                browser.storage.local.set(data)
            })
        }
    })
}

function stringPath(obj, path) {
    const p = path.split(".");
    let out = obj;
    for (const section of p) {
        out = out[section];
    }
    return out;
}