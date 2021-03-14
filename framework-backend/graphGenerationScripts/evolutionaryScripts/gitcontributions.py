import re
import subprocess as sp

print("Begining to capture git history...")

sp.call("git log --all >> commitHistory.csv", shell=True)

commitList = []

with open('commitHistory.csv', 'r') as ch:

   try:
       for line in ch:
           matchCommit = re.match(r'commit .*',line,re.M|re.I)
           if matchCommit:
               commitHash = matchCommit.string.splitlines()[0].split(' ')[1]

           matchAuthor = re.match(r'Author: .*',line,re.M|re.I) 
           if matchAuthor and commitHash:
               commitAuthor = matchAuthor.string.splitlines()[0].split(': ')[1]
               commitList.append([commitHash,commitAuthor])
               commitHash = None 
               commitAuthor = None

   except Exception as e: 
       pass
       #print(e) 

emptyCommits = []

for index, commit in enumerate(commitList):
    #print("{0} Files".format(commit[0]))
    call = 'git diff-tree -no-commit-id --name-only -r {0}'.format(commit[0])
    callback = sp.check_output(call, shell=True).decode('utf-8').splitlines()
    if (callback != None) and (callback != []):
        for line in callback[1:]:
            commit.append(line)
    else:
        print('Following commits are empty (ie no files changed)...')
        print(commit[0])
        emptyCommits.append(index)

#Remove Commits that contain no file changes.
print('Removing Empty Commits...')
for index, emptyIndex in enumerate(emptyCommits):
    commitList.pop(emptyIndex-index)

with open('commitHistory.csv', 'w') as ct:
    line = None 
    for commit in commitList:
        try: 
            line = ','.join(commit) + '\n'
        except:
            pass

        if line != None:
            ct.write(line)

print('Extracted commit history to commitHistory.csv...')
print('Finished.')
#    with open('temp.txt', 'r') as temptywempty:
#        for index, line in enumerate(temptywempty):
#            if index != 0:
#                commit.append(line)

# #print(commitList)

# with open('commitHistory.txt','w') as ch:
#     for line in commitList:
#         #ch.write(','.join(line))
#         print(line)
