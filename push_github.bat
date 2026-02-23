@echo off
git add .
git commit -m "Update for TrackcodexBeta"
git remote set-url origin https://github.com/Quantaforge-trackcodex/TrackcodexBeta.git
git push -u origin main
echo DONE > done.txt
