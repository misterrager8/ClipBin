from ClipBin import create_app
import config
import webview

app = create_app(config)

if __name__ == "__main__":
    webview.create_window("ClipBin", app, text_select=True, frameless=True)
    webview.start()
