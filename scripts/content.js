adCloseJobRunning = false
adCloseJob = null
startAdAutoClose()

function autoCloseAd() {
    // Check if ad is loaded by checking for ad btn
    let adBtn = document.getElementsByClassName("ytp-ad-button-icon")?.[0]
    if (!adBtn) {
        return null
    }

    adCloseJobRunning = true

    if (adCloseJob) {
        adCloseJobRunning = false
        clearInterval(adCloseJob)
        adCloseJob = null
    }

    adBtn.click()

    // Give some time for modal to load
    setTimeout(() => {
        let container =
            document.getElementById("iframe")?.contentWindow?.document

        if (!container) {
            adCloseJobRunning = false
            return
        }

        const adActionBtns = container.getElementsByTagName("button")

        const outBtn = ([...adActionBtns] || []).find((btnEl) => {
            return btnEl.textContent.trim().toLowerCase() === "block ad"
        })

        if (!outBtn) {
            adCloseJobRunning = false
            startAdAutoClose()
            return
        }

        outBtn && outBtn.click()

        setTimeout(() => {
            let continueBtn = [
                ...document
                    .getElementById("iframe")
                    ?.contentWindow?.document.getElementsByTagName("div"),
            ].find(
                (divEl) =>
                    divEl.role === "button" &&
                    divEl.textContent.trim().toLowerCase() === "continue"
            )

            console.log({ continueBtn })

            if (!continueBtn) {
                adCloseJobRunning = false
                clearInterval(adCloseJob)
                adCloseJob = null
            }
            continueBtn.click && continueBtn.click()

            setTimeout(() => {
                let closeBtn = [...adActionBtns].find(
                    (btn) => btn.ariaLabel === "Close"
                )

                closeBtn.click && closeBtn.click()
            }, 500)
        }, 500)
    }, 3000)
}

function startAdAutoClose() {
    console.log("Starting setinterval")
    if (!adCloseJobRunning) {
        adCloseJob = setInterval(autoCloseAd, 2000)
    }
    return []
}
