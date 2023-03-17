function App() {
    const [clips, setClips] = React.useState([]);
    const [clip, setClip] = React.useState([]);
    const [mode, setMode] = React.useState('view');
    const [saved, setSaved] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [theme, setTheme] = React.useState(localStorage.getItem('ClipBin'));

    const changeTheme = (theme_) => {
        localStorage.setItem('ClipBin', theme_);
        document.documentElement.setAttribute('data-theme', theme_);
        setTheme(theme_);
    }

    const home = () => {
        getClips();
        setClip([]);
    }

    const createClip = () => {
        setLoading(true);
        $.get('/create_clip', function(data) {
            getClips();
            setClip(data);
            setLoading(false);
            setMode('edit');
        });
    }

    const getClips = () => {
        setLoading(true);
        $.get('/clips', function(data) {
            setClips(data.clips_);
            setLoading(false);
        });
    }

    const search = (e) => {
        e.preventDefault();
        setLoading(true);
        $.post('/search', {
            query: $('#search').val()
        }, function(data) {
            setClips(data.results);
            setLoading(false);
        });
    }

    const getClip = (name) => {
        setLoading(true);
        localStorage.setItem('last-clip-opened', name);
        $.get('/clip', {
            name: name
        }, function(data) {
            setClip(data);
            setLoading(false);
        });
    }

    const copyClip = () => {
        navigator.clipboard.writeText(clip.content);
        setCopied(true);
        setTimeout(function() { setCopied(false); }, 1500);
    }

    const renameClip = (e) => {
        setLoading(true);
        e.preventDefault();
        $.post('/rename_clip', {
            name: clip.name,
            new_name: $('#clip-name').val()
        }, function(data) {
            getClips();
            setClip(data);
            setLoading(false);
        });
    }

    const editClip = () => {
        setLoading(true);
        $.post('/edit_clip', {
            name: clip.name,
            content: $('#content').val()
        }, function(data) {
            getClips();
            getClip(clip.name);
            setSaved(true);
            setTimeout(function() { setSaved(false); }, 1500);
            setLoading(false);
        });
    }

    const deleteClip = () => {
        setLoading(true);
        $.get('/delete_clip', {
            name: clip.name
        }, function(data) {
            getClips();
            setClip([]);
            setLoading(false);
            setDeleting(false);
        });
    }

    React.useEffect(() => {
        changeTheme(theme);
        getClips();
        localStorage.getItem('last-clip-opened') && getClip(localStorage.getItem('last-clip-opened'));
    }, []);

    return (
        <div className="p-4">
            <nav className="py-3 sticky-top">
                <a onClick={() => home()} className="btn btn-sm text-secondary">{loading ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-paperclip"></i>} ClipBin</a>
                <a data-bs-target="#themes" data-bs-toggle="dropdown" className="btn btn-sm text-secondary dropdown-toggle text-capitalize"><i className="bi bi-paint-bucket"></i> {theme}</a>
                <a target="_blank" href="http://github.com/misterrager8/ClipBin" className="btn btn-sm text-secondary"><i className="bi bi-info-circle"></i> About</a>
                <div className="dropdown-menu text-center" id="themes">
                    {theme !== 'light' && <a onClick={() => changeTheme('light')} className="dropdown-item text-capitalize small">light</a>}
                    {theme !== 'dark' && <a onClick={() => changeTheme('dark')} className="dropdown-item text-capitalize small">dark</a>}
                    {theme !== 'cornflower' && <a onClick={() => changeTheme('cornflower')} className="dropdown-item text-capitalize small">cornflower</a>}
                    {theme !== 'sunset' && <a onClick={() => changeTheme('sunset')} className="dropdown-item text-capitalize small">sunset</a>}
                </div>
            </nav>
            <div className="row">
                <div className="col-3">
                    <a className="btn btn-sm btn-success mb-2 w-100" onClick={() => createClip()}><i className="bi bi-file-earmark-plus"></i> New Clip</a>
                    <form onSubmit={(e) => search(e)} className="input-group input-group-sm mb-3">
                        <input autoComplete="off" className="form-control form-control-sm" placeholder="Search" id="search"/>
                        <button type="submit" className="btn btn-outline-secondary"><i className="bi bi-search"></i></button>
                    </form>
                    {clips.map((x, id) => (
                        <div key={id} style={{ borderBottom:'1px dotted' }} className={'hover px-3 py-2 ' + (x.name === clip.name ? 'selected' : '')}>
                            <a onClick={() => getClip(x.name)}>
                                <div className="heading mb-1">{x.stem}</div>
                                <div className="small opacity-50 fw-light"><i className="bi bi-pencil-square me-1"></i> {x.last_modified}</div>
                            </a>
                        </div>
                    ))}
                </div>
                <div className="col-9">
                    <div className="sticky-top">
                        {clip.length !== 0 && (
                            <div>
                                <form onSubmit={(e) => renameClip(e)}>
                                    <input id="clip-name" autoComplete="off" className="form-control border-0 my-1 p-0 fs-1" defaultValue={clip.stem} key={clip.name}/>
                                </form>
                                <div className="btn-group btn-group-sm my-3">
                                    <a className={'btn btn-outline-' + (copied ? 'primary' : 'secondary')} onClick={() => copyClip()}><i className={'bi bi-' + (copied ? 'check-lg' : 'clipboard')}></i> {'Cop' + (copied ? 'ied.' : 'y')}</a>
                                    <a className={'btn btn-outline-secondary ' + (mode === 'view' && 'active')} onClick={() => setMode('view')}><i className="bi bi-eye"></i> View</a>
                                    <a className={'btn btn-outline-secondary ' + (mode === 'edit' && 'active')} onClick={() => setMode('edit')}><i className="bi bi-pen"></i> Edit</a>
                                    {mode === 'edit' && <a className="btn btn-outline-success" onClick={() => editClip()}><i className={'bi bi-' + (saved ? 'check-lg' : 'save2')}></i> {'Save' + (saved ? 'd.' : '')}</a>}
                                </div>
                                <div className="btn-group btn-group-sm my-3 float-end">
                                    {deleting && <a className="btn text-danger" onClick={() => deleteClip()}>Delete?</a>}
                                    <a className="btn btn-outline-danger" onClick={() => setDeleting(!deleting)}><i className="bi bi-trash2"></i> Delete</a>
                                </div>
                                {mode === 'view' ? (
                                    <div style={{ whiteSpace:'pre-wrap' }}>{clip.content}</div>
                                ) : (
                                    <textarea rows="25" id="content" className="form-control form-control-sm" key={clip.stem} defaultValue={clip.content}></textarea>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
