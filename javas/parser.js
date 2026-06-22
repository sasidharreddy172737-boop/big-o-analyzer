//remove comments
function removecomments(code) {
    code = code.replace(/#.*$/gm, "")
    return code
}
//split into lines
function splitintolines(code) {
    return code.split('\n')
}
// checking for loop
function checkingforloop(lines) {
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim().toLowerCase()
        if (/for\s+\w+\s+in/.test(line)) {
            return true
        }
    }
    return false
}
// checking while loop
function checkingwhileloop(lines) {
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim().toLowerCase()
        if (/while\s+([^:]+)\s*:/.test(line)) {
            return true
        }
    }
    return false
}
//builtin sort function
function builtinsort(lines) {
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim().toLowerCase()
        if (/\w+\s*\.\s*sort\s*\(/.test(line) || /sorted\(\w+/.test(line)) {
            return true
        }
    }
    return false
}
//count how many loops
function howmanyloops(lines) {
    let count = 0
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim().toLowerCase()
        let forMatches = line.match(/for\s+\w+\s+in/g)
        if (forMatches) {
            count += forMatches.length
        }
        if (/while\s+([^:]+)\s*:/.test(line)) {
            count++
        }
    }
    return count
}
// finding depth off loops or nested loops 
function depthofloops(lines) {
    let maxdepth = 0
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        let trimmed = line.trim().toLowerCase()
        if (/for\s+\w+\s+in/.test(trimmed) ||
            /while\s+([^:]+)\s*:/.test(trimmed)) {
            let spaces = line.search(/\S/)
            if (spaces < 0) spaces = 0
            let depth = Math.floor(spaces / 4) + 1
            if (depth > maxdepth) {
                maxdepth = depth
            }
        }
    }
    return maxdepth
}
// detect  log pattern
function logpattern(lines) {
    let save = -1
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim().toLowerCase()
        if (/for\s+\w+\s+in/.test(line) || /while\s+([^:]+)\s*:/.test(line)) {
            save = i
        }
    }
    for (let i = 0; i < lines.length; i++) {
        let trimmed = lines[i].trim().toLowerCase()
        if (save !== -1 && save < i && (/\w+\s*\/\/=\s*2/.test(trimmed) || /\w+\s*=\s*\w+\s*\/\/\s*2/.test(trimmed) || /\w+\s*=\s*\w+\s*\/\/\s*[3-9]/.test(trimmed) || /\w+\s*\/\/=[3-9]/.test(trimmed))) {
            return true
        }
        if (save !== -1 && save < i && (/\w+\s*\*=\s*2/.test(trimmed) || /\w+\s*=\s*\w+\s*\*\s*2/.test(trimmed))) {
            return true
        }
        if (save !== -1 && save < i && /\w+\s*>>=\s*1/.test(trimmed)) {
            return true
        }
        if (save !== -1 && save < i && /\w+\s*=\s*\(\s*\w+\s*\+\s*\w+\s*\)\s*\/\/\s*2/.test(trimmed) && !/while\s+True\s*:/.test(trimmed)) {
            return true
        }
    }
    return false
}
function calculatecomplexity(lines) {
    let loops = []
    let isLogOverall = logpattern(lines)

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        let trimmed = line.trim().toLowerCase()
        let isFor = /for\s+\w+\s+in/.test(trimmed)
        let isWhile = /while\s+([^:]+)\s*:/.test(trimmed)
        if (isFor || isWhile) {
            let spaces = line.search(/\S/)
            if (spaces < 0) spaces = 0
            let depth = Math.floor(spaces / 4) + 1
            let loopComplexity = "n"
            if (isLogOverall) {
                loopComplexity = "logn"
            }
            loops.push({
                depth: depth,
                complexity: loopComplexity
            })
        }
    }

    if (loops.length === 0) return "O(1)"

    // find max depth
    let maxDepth = 0
    for (let i = 0; i < loops.length; i++) {
        if (loops[i].depth > maxDepth) {
            maxDepth = loops[i].depth
        }
    }

    // multiply nested complexities
    let nestedComplexity = ""
    for (let d = 1; d <= maxDepth; d++) {
        for (let i = 0; i < loops.length; i++) {
            if (loops[i].depth === d) {
                if (nestedComplexity === "") {
                    nestedComplexity = loops[i].complexity
                } else {
                    nestedComplexity = nestedComplexity +
                        "*" + loops[i].complexity
                }
                break
            }
        }
    }

    // handle separate loops
    let depth1loops = []
    for (let i = 0; i < loops.length; i++) {
        if (loops[i].depth === 1) {
            depth1loops.push(loops[i])
        }
    }

    if (depth1loops.length > 1) {
        let hasSeparateN = false
        for (let i = 0; i < depth1loops.length; i++) {
            if (depth1loops[i].complexity === "n") {
                hasSeparateN = true
            }
        }
        if (nestedComplexity === "logn" && hasSeparateN) {
            nestedComplexity = "n"
        }
    }

    return converttoO(nestedComplexity)
}

function converttoO(complexity) {
    if (complexity === "n*n*n") return "O(n³)"
    if (complexity === "n*n") return "O(n²)"
    if (complexity === "n*logn") return "O(n log n)"
    if (complexity === "n*n*logn") return "O(n² log n)"
    if (complexity === "logn*n") return "O(n log n)"
    if (complexity === "logn") return "O(log n)"
    if (complexity === "n") return "O(n)"
    return "O(1)"
}

function findspacecomplexity(code) {
    if (/\[\s*\[/.test(code)) return "O(n²)"
    if (/=\s*\[\]/.test(code) ||
        /\.append\(/.test(code) ||
        /=\s*list\(/.test(code) ||
        /=\s*\{\}/.test(code) ||
        /=\s*dict\(/.test(code) ||
        /=\s*set\(/.test(code)) return "O(n)"
    return "O(1)"
}