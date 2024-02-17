// We create a class for each node within the tree
class MatchTeamData {
    constructor(id, logoUrl, name) {
        this.teamId = id
        this.logoUrl = logoUrl
        this.name = name
    }
}
class MatchData {
    constructor(matchId, team1, team2, team1Score, team2Score, matchDate, matchState) {
        this.matchId = matchId;
        this.team1 = team1;
        this.team2 = team2;
        this.team1Score = team1Score;
        this.team2Score = team2Score;
        this.matchDate = matchDate;
        this.matchState = matchState;
    }
}
class CupMatch {
    // Each node has three properties, its value, a pointer that indicates the node to its left and a pointer that indicates the node to its right
    constructor(match) {
        this.match = match
        this.left = null
        this.right = null
    }
}
// We create a class for the BST
class CupChampionTree {

    // The tree has only one property which is its root node
    constructor(teamsCount, matches) {
        this.root = null;
        let matchesCount = this.getMatchesCountInCup(teamsCount);
        for (let i = 0; i < matchesCount; i++) {
            this.structure(null)
        }
        let nodes = this.getNodesFromBottomToTop();
        for (let i = 0; i < matches.length; i++) {
            const node = nodes.pop();
            node.match = matches[i]
        }
    }
    getMatchesCountInCup(teamsCount) {
        let count = 0;
        let levelsCount = Math.floor(Math.log2(teamsCount));
        for (let i = 0; i < levelsCount; i++) {
            count += Math.pow(2, i);
        }
        return count;
    }
    structure(match) {
        let newNode = new CupMatch(match);
        if (this.root === null) {
            this.root = newNode;
            return;
        }
        let queue = [this.root]
        while (queue.length > 0) {
            let current = queue.shift()
            if (current.left === null) {
                current.left = newNode;
                return;
            } else {
                queue.push(current.left);
            }
            if (current.right === null) {
                current.right = newNode;
                return;
            } else {
                queue.push(current.right);
            }
        }
    }
    getNodesFromBottomToTop() {
        if (this.root === null) return [];
        let res = [this.root];
        let queue = [this.root]
        while (queue.length > 0) {
            let current = queue.shift()
            if (current.left !== null) {
                queue.push(current.left);
                res.push(current.left);
            }
            if (current.right !== null) {
                queue.push(current.right);
                res.push(current.right);
            }
        }
        return res;
    }
}

module.exports = { MatchTeamData, CupMatch, MatchData, CupChampionTree }