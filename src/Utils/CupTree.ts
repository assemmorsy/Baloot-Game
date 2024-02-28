// We create a class for each node within the tree
enum MatchState {
    Done = "انتهت",
    Live = "مباشر",
    Upcoming = "لم تبدأ بعد",
    Undefined = "لم يحدد بعد"
}

class MatchTeamData {
    teamId: number;
    logoUrl: string;
    name: string;
    constructor(id: number, logoUrl: string, name: string) {
        this.teamId = id
        this.logoUrl = logoUrl
        this.name = name
    }
}
class MatchData {
    matchId: number;
    team1: MatchTeamData | null;
    team2: MatchTeamData | null;
    team1Score: number;
    team2Score: number;
    matchDate: Date;
    matchState: MatchState;
    constructor(matchId: number, team1: MatchTeamData, team2: MatchTeamData, team1Score: number, team2Score: number, matchDate: Date, matchState: MatchState) {
        this.matchId = matchId;
        this.team1 = team1;
        this.team2 = team2;
        this.team1Score = team1Score;
        this.team2Score = team2Score;
        this.matchDate = matchDate;
        this.matchState = matchState;
    }
    static createUndefinedMatch(team1Data: MatchTeamData | null = null, team2Data: MatchTeamData | null = null) {
        return new MatchData(-1, team1Data, team2Data, -1, -1, null, MatchState.Undefined);
    }
    getWinnerTeamId(): number {
        if (this.matchState === MatchState.Done) {
            if (this.team1Score > this.team2Score)
                return this.team1!.teamId;
            else if (this.team1Score < this.team2Score)
                return this.team2!.teamId;
            else return -1;
        } else {
            return -1;
        }
    }
}

class CupMatch {
    match: MatchData;
    left: CupMatch | null;
    right: CupMatch | null;
    constructor(match: MatchData) {
        this.match = match
        this.left = null
        this.right = null
    }
    isLeafNode(): boolean { return this.left === null && this.right === null }
    getHeight(): number {
        return this.internalHeight(this);
    }
    internalHeight(node: CupMatch): number {
        if (node === null) return 0;
        return 1 + Math.max(this.internalHeight(node.left), this.internalHeight(node.right));
    }
}

class CupChampionTree {
    root: CupMatch | null;
    matches: MatchData[];
    teams: { [id: number]: MatchTeamData };
    constructor(teamsCount: number, matches: MatchData[], teamsData: { [id: number]: MatchTeamData }) {
        this.root = null;
        this.matches = matches;
        this.teams = teamsData;
        let matchesCount = this.getMatchesCountInCup(teamsCount);
        for (let i = 0; i < matchesCount; i++) { this.structure(new MatchData(-1, null, null, -1, -1, null, MatchState.Undefined)) }
        this.applyMatchesToLeafNodes();
        this.applyMatchesToNodes();
    }

    getMatchesCountInCup(teamsCount: number): number {
        let count = 0;
        let levelsCount = Math.floor(Math.log2(teamsCount));
        for (let i = 0; i < levelsCount; i++) {
            count += Math.pow(2, i);
        }
        return count;
    }

    structure(match: MatchData) {
        let newNode = new CupMatch(match);
        if (this.root === null) {
            this.root = newNode;
            return;
        }
        let queue = [this.root]
        while (true) {
            let current = queue.shift()
            if (!current) break;

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

    applyMatchesToLeafNodes() {
        return this.applyMatchToLeafNode(this.root);
    }

    applyMatchToLeafNode(node: CupMatch | null) {
        if (node === null) return;
        if (node.isLeafNode()) {
            node.match = this.matches.shift() ?? null;
            return;
        } else {
            this.applyMatchToLeafNode(node.right);
            this.applyMatchToLeafNode(node.left);
            return;
        }
    }

    applyMatchesToNodes() {
        return this.applyMatchToNodes(this.root);
    }

    applyMatchToNodes(node: CupMatch | null) {

        if (node === null || node.isLeafNode()) return;

        this.applyMatchToNodes(node.right);
        this.applyMatchToNodes(node.left);
        let leftWinnerId = node.left?.match?.getWinnerTeamId() ?? -1;
        let rightWinnerId = node.right?.match?.getWinnerTeamId() ?? -1;
        if (leftWinnerId === -1 && rightWinnerId === -1) {
            MatchData.createUndefinedMatch();
            return;
        }
        else if (leftWinnerId === -1 || rightWinnerId === -1) {
            if (leftWinnerId !== -1)
                MatchData.createUndefinedMatch(null, this.teams[leftWinnerId]);
            if (rightWinnerId !== -1)
                MatchData.createUndefinedMatch(this.teams[rightWinnerId], null);
        }
        else {
            let match = this.matches.find(match =>
                (match.team1.teamId === rightWinnerId || match.team1.teamId === leftWinnerId)
                && (match.team2.teamId === rightWinnerId || match.team2.teamId === leftWinnerId))
            if (match !== undefined) {
                node.match = match;
                return;
            } else {
                node.match = MatchData.createUndefinedMatch(this.teams[rightWinnerId], this.teams[leftWinnerId]);
                return;
            }
        }
    }
    getLevelsArrays(): MatchData[][] {
        if (this.root === null) return [];
        let queue = [this.root]
        let maxHeight = this.root.getHeight();
        const res: MatchData[][] = new Array(maxHeight).fill([]).map(() => []);
        res[maxHeight - 1].push(this.root.match);
        while (true) {
            let current = queue.shift()
            if (!current) break;
            if (current.left !== null) {
                queue.push(current.left);
                res[current.left.getHeight() - 1].push(current.left.match)
            }
            if (current.right !== null) {
                queue.push(current.right);
                res[current.right.getHeight() - 1].push(current.right.match)
            }
        }
        return res;
    }
}

module.exports = { MatchTeamData, CupMatch, MatchData, CupChampionTree }