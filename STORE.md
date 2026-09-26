# Chrome Web Store checklist

- [ ] optimize `icon.png` (671KB -> <100KB, export 16/48/128) and `popup.png`
- [ ] add 1280x800 promo + 2 screenshots
- [ ] store description from README.md + legal notice (not affiliated with Roblox)
- [ ] upload zip from GitHub Release v1.1.0
- [ ] add store link back to README badges

## Release zip
```powershell
Compress-Archive -Path manifest.json,popup.html,popup.js,content.js,style.css,icon.png -DestinationPath FZRBX-1.1.0.zip
```
