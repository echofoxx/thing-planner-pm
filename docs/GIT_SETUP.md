# Git Setup

## Option A: create a new GitHub repo

1. Go to GitHub under `echofoxx`.
2. Create a repository named `thing-planner-pm`.
3. Do not initialize it with a README if you are pushing this package as-is.
4. Run:

```bash
cd thing-planner-pm
git init
git add .
git commit -m "Initial Thing Planner PM prototype"
git branch -M main
git remote add origin https://github.com/echofoxx/thing-planner-pm.git
git push -u origin main
```

## Option B: existing repo

```bash
cd /path/to/existing/repo
cp -R /path/to/thing-planner-pm/* .
git add .
git commit -m "Add Thing Planner PM prototype"
git push
```
