$(document).ready(function() {
    localStorage.getItem('ClipBin') === 'dark' ? setDark() : setLight();
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

function addTemplate() {
    $.post('add_template', {
        name: $('#name').val()
    }, function(data) {
        window.location.reload();
    });
}

function deleteTemplate(name) {
    $.get('delete_template', {
        name: name
    }, function(data) {
        window.location.reload();
    });
}

const AddTemplateForm = () => `
<form class="input-group input-group-sm" onsubmit="event.preventDefault(); addTemplate();">
    <input required autocomplete="off" class="form-control border-success" id="name" placeholder="New Template">
    <button type="submit" class="btn btn-outline-success"><i class="bi bi-plus-lg"></i></button>
</form>
`;

const Navbar = () => `
<nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
        <div class="collapse navbar-collapse">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <div onclick="setLight()" id="dark" class="nav-link"><i class="bi-sun-fill"></i> Light</div>
                    <div onclick="setDark()" id="light" class="nav-link"><i class="bi-moon-fill"></i> Dark</div>
                </li>
            </ul>
        </div>
    </div>
</nav>
`;

function generateTemplate(name) {
    $.post('/generate_template', {
        name: name,
        params: $('#genForm').serialize()
    }, function(data) {
        $('#content').text(data);
        copyText();
    });
}

function copyText() {
    navigator.clipboard.writeText($('#content').text());
    $('#copy-btn').toggleClass(['bi-clipboard', 'bi-clipboard-check']);
    setTimeout(function() { $('#copy-btn').toggleClass(['bi-clipboard', 'bi-clipboard-check']); }, 1500);
}

function editTemplate(name) {
    $.post('edit_template', {
        name: name,
        text: $('#content').val()
    }, function(data) {
        $('#saved').text('Saved.');
        setTimeout(function() { $('#saved').text('Autosave: ON'); }, 1500);
    });
}

function setVariables(name) {
    $.post('set_variables', {
        name: name,
        variables: $('#vars').val()
    }, function(data) {
        
    });
}

const Template = (template_, id, mode) => {
    $('div[id^="temp"]').removeClass('selected');
    $('#temp' + id).addClass('selected');
    $.get('/get_template', {
        name: template_
    }, function(data) {
        $('#template').html(`
            <div class="sticky-top">
                <p class="heading fs-italic fs-3 mb-3">${data.name}</p>
                <div class="btn-group btn-group-sm mb-3">
                    <a class="btn btn-outline-secondary" onclick="copyText()"><i class="bi bi-clipboard" id="copy-btn"></i> Copy</a>
                    ${mode === 'view' ? `<a class="btn btn-outline-secondary" onclick="Template('${template_}', '${id}', 'edit')"><i class="bi bi-pen"></i> Edit</a>`:`
                    <a class="btn btn-outline-secondary" onclick="Template('${template_}', '${id}', 'view')"><i class="bi bi-eye"></i> View</a>`}
                    <a class="btn btn-outline-danger" onclick="$('#delete').fadeToggle(150);"><i class="bi bi-trash2"></i> Delete</a>
                    <a id="delete" style="display:none" class="btn text-danger" onclick="deleteTemplate('${data.name}')">Delete?</a>
                </div>
                ${mode === 'view' ? `
                <form ${data.variables.length === 0 && 'style="display:none"'} onsubmit="event.preventDefault(); generateTemplate('${template_}');" class="input-group input-group-sm mb-3" id="genForm">
                    ${data.variables.map((x) => `<input autocomplete="off" class="form-control" placeholder="${x}" name="${x}"/>` ).join('')}
                    <button type="submit" class="btn btn-outline-success">Generate</button>
                </form>
                <div style="white-space: pre-wrap; font-size: 0.9em;" id="content"></div>
                ` : `
                <div>
                    <span id="saved" class="text-success heading">Autosave: ON</span>
                    <input onchange="setVariables('${data.name}')" id="vars" autocomplete="off" class="form-control form-control-sm mt-3" value="${data.variables.join(',')}">
                    <textarea onchange="editTemplate('${data.name}')" id="content" class="form-control form-control-sm mt-3" rows=30>${data.content}</textarea>
                </div>
                `}
            </div>
            `);
        $('#content').text(data.content);
    });
}

const App = () => {
    $.get('/get_templates', function(data) {
        $('#templates').html(`<div class="mb-3">${AddTemplateForm()}</div>`);
        for (let[id, x] of data.templates.entries()) {
            $('#templates').append(`
                <div class="py-2 px-3" id="temp${id}">
                    <a class="heading" onclick="Template('${x.name}', '${id}', 'view')">${x.name}</a><br>
                    <div class="text-muted fst-italic small"><i class="bi bi-plus-lg"></i> ${x.date_created}</div>
                </div>
                `);
        }
    });

    return `
    <div>
        ${Navbar()}
        <div class="row mt-3">
            <div id="templates" class="col-3"></div>
            <div id="template" class="col-9"></div>
        </div>
    </div>
    `;
}

$('#root').html(App());
