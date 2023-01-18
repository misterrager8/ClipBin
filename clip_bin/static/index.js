$(document).ready(function() {
    changeTheme(localStorage.getItem('ClipBin'));
});

function changeTheme(theme) {
    localStorage.setItem('ClipBin', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
        $('#dark').show();
        $('#light').hide();
    } else {
        $('#dark').hide();
        $('#light').show();
    }
}

function addTemplate() {
    $.post('add_template', {
        name: $('#name').val()
    }, function(data) {
        Template(data.name, 0, 'edit');
        // window.location.reload();
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
<form onsubmit="event.preventDefault(); addTemplate();">
    <label class="small text-success" for="name"><i class="bi bi-plus-lg"></i> New Template</label>
    <input required autocomplete="off" class="form-control form-control-sm border-success mt-1" id="name">
</form>
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
        $('#saved').toggleClass(['bi-braces-asterisk', 'bi-check-lg']);
        setTimeout(function() { $('#saved').toggleClass(['bi-braces-asterisk', 'bi-check-lg']); }, 1500);
    });
}

function renameTemplate(name) {
    $.post('rename_template', {
        name: name,
        new_name: $('#template-name').val()
    }, function(data) {
        window.location.reload();
    });
}

function setVariables(name) {
    $.post('set_variables', {
        name: name,
        variables: $('#vars').val()
    }, function(data) {
        $('#save-vars').toggleClass(['bi-input-cursor-text', 'bi-check-lg']);
        setTimeout(function() { $('#save-vars').toggleClass(['bi-input-cursor-text', 'bi-check-lg']); }, 1500);
    });
}

const Settings = () => {
    $.get('/get_settings', function(data) {
        $('#body').html(`
            <a onclick="Home()" class="btn btn-sm text-secondary p-0 mb-3"><i class="bi bi-arrow-left"></i> Home</a>
            <form class="col-4" onsubmit="event.preventDefault(); changeSettings();">
                <div class="mb-3">
                    <label for="port" class="small text-muted mb-1">Port</label>
                    <input autocomplete="off" class="form-control form-control-sm" id="port" value="${data.port}">
                </div>
                <div class="mb-3">
                    <label for="home_dir" class="small text-muted mb-1">Home Directory</label>
                    <input autocomplete="off" class="form-control form-control-sm" id="home_dir" value="${data.home_dir}">
                </div>
                <button type="submit" class="btn btn-sm btn-outline-success w-100"><i class="bi bi-save2"></i> Apply Changes (Requires Restart)</button>
            </form>
            `);
    });
}

function changeSettings() {
    $.post('/get_settings', {
        home_dir: $('#home_dir').val(),
        port: $('#port').val()
    }, function(data) {
        window.location.reload();
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
            <input onchange="renameTemplate('${data.stem}')" autocomplete="off" class="form-control border-0 p-0 fs-3 mb-3 heading" id="template-name" value="${data.stem}">
                <div class="btn-group btn-group-sm mb-3">
                    <a class="btn btn-outline-secondary" onclick="copyText()"><i class="bi bi-clipboard" id="copy-btn"></i> Copy</a>
                    ${mode === 'view' ? `<a class="btn btn-outline-secondary" onclick="Template('${template_}', '${id}', 'edit')"><i class="bi bi-pen"></i> Edit</a>`:`
                    <a class="btn btn-outline-secondary" onclick="Template('${template_}', '${id}', 'view')"><i class="bi bi-eye"></i> View</a>`}
                    <a class="btn btn-outline-danger" onclick="$('#delete').fadeToggle(150);"><i class="bi bi-trash2"></i> Delete</a>
                    <a id="delete" style="display:none" class="btn text-danger" onclick="deleteTemplate('${data.name}')">Delete?</a>
                </div>
                ${mode === 'view' ? `
                <form ${data.variables.length === 0 && 'style="display:none"'} onsubmit="event.preventDefault(); generateTemplate('${template_}');" class="row mb-3" id="genForm">
                    ${data.variables.map((x) => `
                        <div class="col-4 mb-3">
                            <label class="small text-secondary">${x}</label>
                            <input autocomplete="off" class="form-control form-control-sm mt-1" name="${x}"/>
                        </div>
                        ` ).join('')}
                    <button type="submit" class="btn btn-sm btn-outline-success w-100 mx-2"><i class="bi bi-file-text"></i> Generate</button>
                </form>
                <div style="white-space: pre-wrap; font-size: 0.9em;" id="content"></div>
                ` : `
                <div>
                    <div>
                        <label class="small text-secondary mt-3"><i id="save-vars" class="bi bi-input-cursor-text"></i> Variables</label>
                        <input onchange="setVariables('${data.name}')" id="vars" autocomplete="off" class="form-control form-control-sm mt-1" value="${data.variables.join(',')}">
                    </div>
                    <label class="small text-secondary mt-3"><i id="saved" class="bi bi-braces-asterisk"></i> Content</label>
                    <textarea onchange="editTemplate('${data.name}')" id="content" class="form-control form-control-sm mt-1" rows=30>${data.content}</textarea>
                </div>
                `}
            </div>
            `);
        $('#content').text(data.content);
    });
}

const Home = () => {
    $.get('/get_templates', function(data) {
        $('#templates').html(`<div class="mb-3">${AddTemplateForm()}</div>`);
        for (let[id, x] of data.templates.entries()) {
            $('#templates').append(`
                <div class="hover py-2 px-3" id="temp${id}">
                    <a class="heading" onclick="Template('${x.name}', '${id}', 'view')">${x.stem}</a><br>
                    <div class="text-muted fst-italic small"><i class="bi bi-plus-lg"></i> ${x.date_created}</div>
                </div>
                `);
        }
    });

    $('#body').html(`
        <div class="row">
            <div class="col-3">
                <div id="templates"></div>
            </div>
            <div id="template" class="col-9"></div>
        </div>
        `);
}

const App = () => {
    $('#root').html(`
        <div class="">
            <a onclick="changeTheme('light')" id="light" class="btn btn-sm btn-outline-light"><i class="bi-sun-fill"></i> Light</a>
            <a onclick="changeTheme('dark')" id="dark" class="btn btn-sm btn-outline-dark"><i class="bi-moon-fill"></i> Dark</a>
            <a onclick="Settings()" class="btn btn-sm btn-outline-secondary"><i class="bi-gear-fill"></i> Settings</a>
        </div>
        <div id="body" class="mt-3"></div>
        `);
    Home();
}

App();
