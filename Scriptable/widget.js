// © 2021 Nils Kleinert
// -- DON'T TOUCH ANY CODE HERE

const version = "1.1.0"

async function createWidget(filePath) {
    // Create our widget

    let data, header, entry, backend, ready, fileManager
    const list = new ListWidget()

    // Check for update
    data = await new Request("https://api.github.com/repos/nils-kt/Scriptable-Proxmox-Status/releases").loadJSON()

    if(data[0].tag_name !== version) {
        if (!config.runsInWidget) {
            let alert = new Alert()
            alert.title = "Update " + data[0].tag_name
            alert.message = data[0].body
            alert.addCancelAction("Abbrechen")
            alert.addAction("Zu GitHub")
            let res = await alert.presentAlert()
            if (res === 0) {
                await Safari.openInApp("https://github.com/nils-kt/Scriptable-Proxmox-Status/releases", false)
            }
        } else {
            showNotification("Update verfügbar!", "Dein Serverstatus Widget hat ein Update " + data[0].tag_name)
        }
    }

    // Get saved data
    fileManager = FileManager.iCloud()
    if (!fileManager.fileExists(fileManager.joinPath(fileManager.documentsDirectory(), "proxmox_monitoring.cfg"))) {
        if (!config.runsInWidget) {
            let alert = new Alert()
            alert.title = "Konfiguration notwendig"
            alert.message = "Bitte trage die Backend-URL ein"
            alert.addTextField("http://test.tld:3000")
            alert.addCancelAction("Abbrechen")
            alert.addAction("Speichern")
            let res = await alert.presentAlert()
            if (res === 0) {
                let value = alert.textFieldValue(0)
                backend = value
                fileManager.writeString(fileManager.joinPath(fileManager.documentsDirectory(), "proxmox_monitoring.cfg"), value)
                ready = true
            } else {
                ready = false
            }
        }
    } else {
        backend = fileManager.readString(fileManager.joinPath(fileManager.documentsDirectory(), "proxmox_monitoring.cfg"));
        ready = true
    }

    if(!ready) {
        let entry = list.addText("Serverstatus Widget nicht konfiguriert. Bitte öffne Scriptable um das Widget zu konfigurieren.")
        entry.textColor = Color.red()
        entry.centerAlignText()
        return list
    }

    header = list.addText("ℹ️\tServerstatus ".toUpperCase())
    header.centerAlignText()
    header.font = Font.boldSystemFont(14)

    // Get our servers
    data = await new Request(backend).loadJSON()

    for (let i = 0; i < data.length; i++) {
        if (data[i].type === "vm") {
            if (data[i].status !== "running" && data[i].status !== "stopped") {
                showNotification("Warnung " + data[i].name, "Status: " + data[i].status.toUpperCase(), "piano_error")
            }
            list.addSpacer()
            switch (data[i].status) {
                case "running": {
                    entry = list.addText("💾 " + data[i].name + "\t\t👍 " + printUptime(data[i].uptime))
                    entry.textColor = Color.green()
                    break;
                }
                case "stopped": {
                    entry = list.addText("💾 " + data[i].name + "\t\t💤 Gestoppt")
                    entry.textColor = Color.red()
                    break;
                }
                case "suspended": {
                    entry = list.addText("💾 " + data[i].name + "\t\t🔒 " + printUptime(data[i].uptime))
                    entry.textColor = Color.orange()
                    break;
                }
                default: {
                    entry = list.addText("💾 " + data[i].name + "\t\t❓ " + printUptime(data[i].uptime))
                    entry.textColor = Color.gray()
                    break;
                }
            }
        }
    }

    list.addSpacer()
    let footer = list.addText("Letztes Update: " + new Date().toLocaleString())
    footer.font = Font.lightMonospacedSystemFont(7)
    footer.color = Color.darkGray()
    footer.centerAlignText()
    return list
}

function showNotification(title, body, sound = "default") {
    let notification = new Notification()
    notification.title = title
    notification.body = body
    notification.sound = sound
    notification.schedule(0)
}

function printUptime(seconds) {
    let text,
        h = Math.floor(seconds / 3600),
        m = Math.floor(seconds % 3600 / 60)

    if (h > 24) {
        text = Math.floor(h / 24) + " Tage"
    } else {
        if (h < 1) {
            text = m + " Minuten"
        } else {
            text = h + " Stunden"
        }
    }

    return text
}

let widget = await createWidget()
if (!config.runsInWidget) {
    await widget.presentMedium()
}

Script.setWidget(widget)
Script.complete()