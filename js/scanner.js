window.onload = letsbegin;
var allMarksNode = [];
var allMarksUrlNode = [];
var duplink = 0;

function letsbegin() {
    console.log("begin");
    chrome.bookmarks.getTree(function (marks) {
        getMarks(marks[0]);
    })
    console.log("end");
    document.getElementById('finddup').onclick = findDup;
    document.getElementById('dup').onclick = delMark;
}

function getMarks(root) {
    for (var i = 0; i < root.children.length; i++) {
        if (root.children[i].url == null) {
            //console.log("add a folder");
            //console.log(root.children[i]);
            addFolder(root.children[i]);
            getMarks(root.children[i]);
        } else {
            //console.log("add a mark");
            //console.log(root.children[i]);
            addAMark(root.children[i]);
        }
    }
}

function addFolder(f) {
    var fnode = document.createElement('div');
    fnode.setAttribute('class', 'folder');
    fnode.setAttribute('id', 'folder' + f.id);
    fnode.textContent = f.title;
    document.getElementById('folder' + f.parentId).appendChild(fnode);
    //console.log(f.title);
}

function addAMark(m) {
    allMarksUrlNode.push(m);
    //console.log(m.title + "--->" + m.url);
    var mnode = document.createElement('div');
    mnode.setAttribute('class', 'mark');
    mnode.setAttribute('id', 'mark' + m.id);
    var mnodedt = document.createElement('dt');
    var mnodea = document.createElement('a');
    mnodea.setAttribute('href', m.url);
    mnodea.textContent = m.title;
    mnodedt.appendChild(mnodea);
    var mnodedd = document.createElement('dd');
    mnodedd.textContent = m.url;
    mnode.appendChild(mnodedt);
    mnode.appendChild(mnodedd);
    document.getElementById('folder' + m.parentId).appendChild(mnode);
}

function findDup() {
    console.log("begin find dup");
    duplink = 0;
    //console.log(allMarksUrlNode);
    document.getElementById('dup').innerHTML = '';
    for (var i = 0; i < allMarksUrlNode.length; i++) {
        findD(allMarksUrlNode[i], i);
    }
    console.log("end find dup");
    if (duplink == 0) {
        document.getElementById('dup').innerHTML += 'No duplinks';
    } else {
        document.getElementById('dup').innerHTML += duplink + ' duplinks';
    }
}

function findD(urlnode, index) {
    //console.log("find" + urlnode.id + ' ' + urlnode.url); 
    for (var i = index + 1; i < allMarksUrlNode.length; i++) {
        var urlsame = false;
        var titlesame = false;
        if (urlnode.url.toLowerCase().replace(/\s/g, "").replace(/https*:\/\//g, "") ==
            allMarksUrlNode[i].url.toLowerCase().replace(/\s/g, "").replace(/https*:\/\//g, "")) {
            urlsame = true;
            duplink++;
            document.getElementById('dup').innerHTML += 'url same ';
        }
        if (urlnode.title.toLowerCase().replace(/\s/g, "") ==
            allMarksUrlNode[i].title.toLowerCase().replace(/\s/g, "")) {
            titlesame = true;
            duplink++;
            document.getElementById('dup').innerHTML += 'title same ';
        }
        if (urlsame || titlesame) {
            var node1 = document.createElement('div');
            var delbtn1 = document.createElement('input');
            delbtn1.type = 'button';
            delbtn1.id = 'delete' + urlnode.id;
            delbtn1.value = 'delete mark: ' + urlnode.id;
            var dup1 = document.createElement('div');
            dup1.className = 'dup1';
            dup1.id = 'url' + urlnode.id;
            dup1.textContent = urlnode.title + ' -- > ' + urlnode.url;
            node1.appendChild(delbtn1);
            node1.appendChild(dup1);

            var node2 = document.createElement('div');
            var delbtn2 = document.createElement('input');
            delbtn2.type = 'button';
            delbtn2.id = 'delete' + allMarksUrlNode[i].id;
            delbtn2.value = 'delete mark: ' + allMarksUrlNode[i].id;
            var dup2 = document.createElement('div');
            dup2.className = 'dup2';
            dup2.id = 'url' + allMarksUrlNode[i].id;
            dup2.textContent = allMarksUrlNode[i].title + ' -- > ' + allMarksUrlNode[i].url;
            node2.appendChild(delbtn2);
            node2.appendChild(dup2);

            document.getElementById('dup').appendChild(node1);
            document.getElementById('dup').appendChild(node2);
        }
    }
}

function delMark() {
    //console.log(event.target.id);
    if (event.target.id.match(/delete\d+/)) {
        var removeid = event.target.id.match(/\d+/);
        chrome.bookmarks.remove(removeid[0]);
        alert(removeid);
        //allMarksNode = [];
        //allMarksUrlNode = [];
        //letsbegin();
        location.reload(true);
        findDup();
    }

}