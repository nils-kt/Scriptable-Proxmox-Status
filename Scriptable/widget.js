// © 2021 Nils Kleinert

const backend = "http://192.168.178.77:3000"

//// -- DON'T TOUCH ANY CODE HERE


async function createWidget() {
    // Create our widget

    let data, header, entry
    const list = new ListWidget()

    // Get our servers
    data = await new Request(backend).loadJSON()

    header = list.addText("ℹ️\tServerstatus ".toUpperCase())
    header.centerAlignText()
    header.font = Font.boldSystemFont(14)

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

function showNotification(title, subtitle, sound = "default") {
    let notification = new Notification()
    notification.title = tile
    notification.subtitle = subtitle
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
widget.backgroundColor = new Color("1d1f2f")
if (!config.runsInWidget) {
    await widget.presentMedium()
}

Script.setWidget(widget)
Script.complete()