function analyze(code) {
    if (code.trim().length < 5) {
        return {
            time: "THE CODE IS TOO SHORT",
            space: "-"
        }
    }
    let lang = document.getElementById("lang").value
    if (lang != "python") {
        return {
            time: "Python only supported currently",
            space: "More languages coming soon"
        }
    }
    let cleaned = removecomments(code)
    let lines = splitintolines(cleaned)
    lines = lines.filter(function (line) {
        return line.trim() !== ""
    })


    let hasSort = builtinsort(lines)
    let loopCount = howmanyloops(lines)


    if (hasSort && (loopCount === 0 || loopCount === 1)) {
        return {
            time: "O(n log n)",
            space: findspacecomplexity(code)
        }
    }


    return {
        time: calculatecomplexity(lines),
        space: findspacecomplexity(code)
    }

}
