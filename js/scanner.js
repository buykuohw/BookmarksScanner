window.onload = letsbegin;
var allMarks = [];
var dupNum = 0;

function letsbegin() {
    console.log("begin build bookmarks tree");
    document.getElementById('folder0').innerHTML = '';
    chrome.bookmarks.getTree(function (marks) {
        getMarks(marks[0]);
    })
    console.log("end build bookmarks tree");
    document.getElementById('finddupmarkbtn').onclick = findDupMarks;
    document.getElementById('dupmarkdiv').onclick = delAMark;
}

function getMarks(node) {
    for (var i = 0; i < node.children.length; i++) {
        if (node.children[i].url == null) {
            //console.log("add a folder");
            addFolder(node.children[i]);
            getMarks(node.children[i]);
        } else {
            //console.log("add a mark");
            addAMark(node.children[i]);
        }
    }
}

function addFolder(afolder) {
    var divfolder = document.createElement('div');
    divfolder.className = 'folder';
    divfolder.id = 'folder' + afolder.id;
    divfolder.textContent = afolder.title;
    document.getElementById('folder' + afolder.parentId).appendChild(divfolder);
}

function addAMark(amark) {
    allMarks.push(amark);
    var divmark = document.createElement('div');
    divmark.className = 'mark';
    divmark.id = 'mark' + amark.id;
    var dtmark = document.createElement('dt');
    var hrefmark = document.createElement('a');
    hrefmark.href = amark.url;
    hrefmark.textContent = amark.title;
    dtmark.appendChild(hrefmark);
    var ddmark = document.createElement('dd');
    ddmark.textContent = amark.url;
    divmark.appendChild(dtmark);
    divmark.appendChild(ddmark);
    document.getElementById('folder' + amark.parentId).appendChild(divmark);
}

function findDupMarks() {
    console.log("begin find dup");
    dupNum = 0;
    //console.log(allMarks);
    document.getElementById('dupmarkdiv').innerHTML = '';
    for (var i = 0; i < allMarks.length; i++) {
        compareMarks(allMarks[i], i);
    }
    console.log("end find dup");
    document.getElementById('dupmarkdiv').innerHTML += dupNum + ' dupNums';
}

function compareMarks(amark, index) {
    for (var i = index + 1; i < allMarks.length; i++) {
        var urlsame = false;
        var titlesame = false;
        if (amark.url.toLowerCase().replace(/\s/g, "").replace(/https*:\/\//g, "") ==
            allMarks[i].url.toLowerCase().replace(/\s/g, "").replace(/https*:\/\//g, "")) {
            urlsame = true;
            dupNum++;
            document.getElementById('dupmarkdiv').innerHTML += 'Url ';
        }
        if (amark.title.toLowerCase().replace(/\s/g, "") ==
            allMarks[i].title.toLowerCase().replace(/\s/g, "")) {
            titlesame = true;
            dupNum++;
            document.getElementById('dupmarkdiv').innerHTML += 'Title ';
        }
        if (urlsame || titlesame) {
            document.getElementById('dupmarkdiv').innerHTML += 'same: ';
            var node1 = document.createElement('div');
            node1.className = 'dupgroup1';
            var delbtn1 = document.createElement('input');
            delbtn1.type = 'button';
            delbtn1.id = 'delete' + amark.id;
            delbtn1.value = 'delete';
            var dup1 = document.createElement('span');
            dup1.className = 'dup1';
            dup1.id = 'url' + amark.id;
            dup1.textContent = amark.id + ' ' + amark.title + ' ' + amark.url;
            node1.appendChild(delbtn1);
            node1.appendChild(dup1);

            var node2 = document.createElement('div');
            node2.className = 'dupgroup2';
            var delbtn2 = document.createElement('input');
            delbtn2.type = 'button';
            delbtn2.id = 'delete' + allMarks[i].id;
            delbtn2.value = 'delete';
            var dup2 = document.createElement('span');
            dup2.className = 'dup2';
            dup2.id = 'url' + allMarks[i].id;
            dup2.textContent = allMarks[i].id + ' ' + allMarks[i].title + ' ' + allMarks[i].url;
            node2.appendChild(delbtn2);
            node2.appendChild(dup2);

            document.getElementById('dupmarkdiv').appendChild(node1);
            document.getElementById('dupmarkdiv').appendChild(node2);
        }
    }
}

function delAMark() {
    //console.log(event.target.id);
    if (event.target.id.match(/delete\d+/)) {
        var removeid = event.target.id.match(/\d+/);
        chrome.bookmarks.remove(removeid[0]);
        alert(removeid);
        allMarks = [];
        location.reload(true);
    }

}