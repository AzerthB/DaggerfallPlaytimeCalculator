# DaggerfallPlaytimeCalculator
A simple script to approximate your Daggerfall Unity Playtime using savefiles.
# Usage
1. Go to [my website](http://eloibonneville.com/DaggerfallPlaytimeCalculator/index.html)
2. Launch the app
3. Upload your "Saves" directory
4. The script will calculate the lower bound of your total playtime.
# How it works
- Uses the .net times that Daggerfall Unity stores in each savefile
- Calculates the interval of time between each savefile
- If the interval is below 6 hours, the playtime will be added
# Why it works
Playing Daggerfall means dying very often, so saving often is mandatory for any playthrough.
By this logic, each play session will have many different savefiles.
# Issues
The playtime calculated is the lower bound of your real playtime, since each play session starts with the last play session's last save.
Impossible to fix, but it's a negligible difference if the player saves often.
