# VOD application for Samsung Smart TV (Tizen). Built with Vuejs

## Note
* Developed and tested only for Samsung 2017 Smart TV (UM55MU7500) which uses Chrome v47 (47.0.2526.0) and 1920x1080 resolution.
* **Backend API is for private use only**

## Preview ([webm](https://gfycat.com/generalsimilarboubou))
[![](https://i.imgur.com/9W2sFig.jpg)](https://gfycat.com/generalsimilarboubou)

## Resources
<https://developer.samsung.com/tv/develop/getting-started/quick-start-guide>

<https://developer.tizen.org/ko/development/training/web-application/getting-started/creating-your-first-tizen-tv-web-application?langredirect=1#run>

## Tizen Studio configurations and how to import
1. Install and build with  
```
npm install
npm run build
```
2. Tizen Studio -> Import -> Existing Projects Into Workspace -> Select this projects root folder -> Check "UnivisionVod /dist" -> Import
3. To use Chrome Developer Tools

   * Tizen Studio -> Web -> Chrome -> Location -> Browse and choose Chrome/Chromium binary
4. **Disable JSHint** (It's gonna be extremely slow to build if you don't do this)

   * Tizen Studio -> Web -> Editor -> Javascript -> JSHint Properties -> Append "vendors" to "Exclude files that match..." field

## Running/installing app on Tizen Emulator
1. Tizen Studio Package Manager -> Configuration
   * Package Repository: "http://usa.sdk-dl.tizen.org/sdk/tizenstudio"
   * Auto Update: Off
   * Select "Tizen_Studio_1.3"
   * OK
2. Install Main SDK
   * Baseline SDK
   * GCC 4.9 toolchain
   * Web IDE, Web CLI
3. Install Extension SDK
   * TV Extensions-3.0
   * Samsung Certificate Extension
   * TV Extensions Tools
4. Emulator Manager -> Create -> tv-samsung-3.0-x86 (basic)
5. [Continue here](https://developer.tizen.org/ko/development/training/web-application/getting-started/creating-your-first-tizen-tv-web-application?langredirect=1#run)

### Compiles and hot-reloads for development
```
npm run serve
```
