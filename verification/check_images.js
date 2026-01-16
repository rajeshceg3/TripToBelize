const fs = require("fs");
const vm = require("vm");
const https = require("https");

const dataContent = fs.readFileSync("js/data.js", "utf8");
const context = { window: {}, document: { dispatchEvent: () => {} }, CustomEvent: class {} };
vm.createContext(context);
vm.runInContext(dataContent, context);
const locs = context.window.locations;

console.log(`Checking ${locs.length} images...`);

function checkUrl(url) {
    return new Promise((resolve) => {
        const req = https.request(url, { method: "HEAD" }, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve(true);
            } else {
                console.error(`FAIL (${res.statusCode}): ${url}`);
                resolve(false);
            }
        });
        req.on("error", (e) => resolve(false));
        req.end();
    });
}

(async () => {
    let failures = 0;
    for (const loc of locs) {
        if (!await checkUrl(loc.image)) failures++;
    }
    if (failures > 0) process.exit(1);
    else console.log("All images OK.");
})();
