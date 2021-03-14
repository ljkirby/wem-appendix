with open('commitHistory.csv','r') as mpr_csv:
    with open('cleanCommitHistory.csv', "w") as mpr_txt:
        for line in mpr_csv:
            l = line.split('\n')[0]
            if l != '':
                mpr_txt.write(l + '\n')
