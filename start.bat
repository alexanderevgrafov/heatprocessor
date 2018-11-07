@SET L_PATH=file://E:\localhost\srv\heatprocess\js\dist
@SET BROWSER_1="c:\Program files (x86)\Google\Chrome\Application\chrome.exe"
@SET BROWSER=chrome.exe

@start %BROWSER% "%L_PATH%/www/client.html?name=airtower"  "%L_PATH%/www/client.html?name=hotboiler" "%L_PATH%/www/admin.html"
@start node dist/central.js