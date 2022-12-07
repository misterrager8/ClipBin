$(document).ready(function() {
    localStorage.getItem('ClipBin') === 'dark' ? setDark() : setLight();
    getClips();
    setTimeout(function() { getClip(localStorage.getItem('lastClipOpened').split(',')[0], localStorage.getItem('lastClipOpened').split(',')[1]) }, 100);
});

function setDark() {
    localStorage.setItem('ClipBin', 'dark');
    document.documentElement.setAttribute('data-theme', localStorage.getItem('ClipBin'));
    $('#dark').show();
    $('#light').hide();
}

function setLight() {
    localStorage.setItem('ClipBin', 'light');
    document.documentElement.setAttribute('data-theme', localStorage.getItem('ClipBin'));
    $('#light').show();
    $('#dark').hide();
}

const index = () => `
<div class="row mt-4">
    <div class="col-3" id="clips">
        <div class="text-warning py-3"><a onclick="getFavorites()"><i class="bi bi-star"></i> Favorites</a></div>
        <form class="input-group input-group-sm" onsubmit="event.preventDefault(); createClip();">
            <input autocomplete="off" class="form-control border-success" id="name" placeholder="New Clip">
        </form>
        <p class="small fst-italic mb-3 text-muted text-center" id="count"></p>
    </div>
    <div class="col-9" id="clip"></div>
</div>
`;

const clipItem = (clip_, id) => `
<div class="p-2" id="clip${id}">
    <div>
        <a onclick="toggleFavorite('${clip_.name}')" class="text-warning me-2"><i class="bi bi-star${clip_.favorited ?'-fill':''}"></i></a>
        <a onclick="getClip('${clip_.name}', '${id}')" class="font-custom fw-bold">${clip_.stem}</a>
        <span class="text-muted fst-italic">*${clip_.suffix}</span><br>
        <span class="small text-muted fst-italic">${clip_.last_modified}</span>
    </div>
</div>
`;

const clipOptions = (clip_, id) => `
<input autocomplete="off" class="form-control border-0 fw-bold fst-italic fs-3 mb-3" value="${clip_.name}">
<div class="btn-group btn-group-sm mb-3">
    <a id="edit" class="btn text-secondary" onclick="getEditor('${clip_.name}')"><i class="bi bi-pen"></i> Edit</a>
    <a onclick="getClip('${clip_.name}', '${id}')" id="view" class="btn text-secondary" style="display: none"><i class="bi bi-eye"></i> View</a>
    <a onclick="copyClip('${clip_.name}')" class="btn text-secondary"><i id="copy" class="bi bi-clipboard"></i> Copy</a>
    <a onclick="toggleFavorite('${clip_.name}') " class="btn text-warning"><i class="bi bi-star${clip_.favorited?'-fill':''}"></i> Favorite${clip_.favorited?'d':''}</a>
    <a onclick="$('#delete').fadeToggle(150)" class="btn text-danger"><i class="bi bi-trash2"></i> Delete</a>
    <a id="delete" style="display: none" onclick="deleteClip('${clip_.name}')" class="btn text-danger">Delete?</a>
</div>
`;

const clipEditor = (name, content) => `
<div class="">
    <a onclick="editClip('${name}')" class="btn btn-sm btn-outline-success w-100 mb-3"><i id="save" class="bi bi-save"></i> Save</a>
    <textarea id="clipContent" onchange="editClip('${name}')" class="form-control form-control-sm" rows=30>${content}</textarea>
</div>
`;

const settings = () => `
<div>
    <textarea class="form-control" rows=30></textarea>
</div>
`;

function getClips() {
    $.get('get_clips', function(data) {
        $('#index').html(index);
        $('#count').text(`${Object.keys(data.clips).length} clip${Object.keys(data.clips).length != 1 ? 's' : ''}`);
        for (let[id, x] of data.clips.entries()) {
            $('#clips').append(clipItem(x, id));
        }
    });
}

function getFavorites() {
    $.get('get_favorites', function(data) {
        $('#index').html(index);
        $('#count').text(`${Object.keys(data.favorites).length} clip${Object.keys(data.favorites).length != 1 ? 's' : ''}`);
        for (let[id, x] of data.favorites.entries()) {
            $('#clips').append(clipItem(x, id));
        }
    });
}

function createClip() {
    $.post('create_clip', {
        name: $('#name').val()
    }, function(data) {
        getClips();
    });
}

function getClip(name, id) {
    localStorage.setItem('lastClipOpened', `${name},${id}`);
    $('#view').hide();
    $('#edit').show();
    $('.selected').removeClass('selected');
    $('#clip' + id).addClass('selected');
    $.get('get_clip', {
        name: name
    }, function(data) {
        $('#clip').html(`${clipOptions(data)}<div id="content"></div>`);
        $('#content').css('white-space', 'pre-wrap');
        $('#content').text(data.content);
    });
}

function getEditor(name) {
    $('#edit').hide();
    $('#view').show();
    $.get('get_content', {
        name: name
    }, function(data) {
        $('#content').css('white-space', '');
        $('#content').html(clipEditor(data.name, data.content));
    });
}

function copyClip(name) {
    $.get('get_content', {
        name: name
    }, function(data) {
        navigator.clipboard.writeText(data.content);
        $('#copy').toggleClass(['bi-clipboard','bi-clipboard-check', 'text-success']);
        setTimeout(function() { $('#copy').toggleClass(['bi-clipboard','bi-clipboard-check', 'text-success']); }, 1500);
    });
}

function deleteClip(name) {
    $.get('delete_clip', {
        name: name
    }, function(data) {
        getClips();
    });
}

function toggleFavorite(name) {
    $.get('toggle_favorite', {
        name: name
    }, function(data) {
        getClips();
    });
}

function editClip(name) {
    $.post('edit_clip', {
        name: name,
        content: $('#clipContent').val()
    }, function(data) {
        $('#save').toggleClass(['bi-save','bi-check-lg']);
        setTimeout(function() { $('#save').toggleClass(['bi-save','bi-check-lg']); }, 1500);
    });
}

