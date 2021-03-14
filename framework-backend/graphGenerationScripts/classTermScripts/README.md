The class term graph was generated using modifications to [this repo](https://github.com/jinwuxia/RS17_project_program/tree/master/icws2017)

We'll generate the PartsUnlimitedMRP.udb file using scitools Understand.

The package name should be smpl.ordering

run the following

uperl identifierParser.pl PartsUnlimitedMRP.udb  smpl.ordering   PartsUnlimitedMRP_words.txt

When looking at the words.txt file and the classes, we noticed that the MongoOperationsWithRetry was divided up by scitool understand into a bunch of sub classes
which was unexpected.  The file is called MongoOperationsWithRetry and we expected that to be the only class in that file.  We have removed
the words for those subclass from the PartsUnlimitedMRP_words.txt file before putting it through the semanticParser.  We have also removed the
smpl.ordering.repositories.RepositoryFactory. Repositories class from ours words because its a private class only used by RepositoryFactory.  
No significant words were added by the classes so they really only increased the document count and skewed results.

Now we have the words, we'll generate the new stop words for parts unlimited.

partsunlimitedmrp_stop_words = ['public', 'private','protected','static', 'null', 'class', 'system','out', 'in', 'print', 'println', 'debug',\
                    'int','string', 'this', 'return', 'double', 'throw', 'exception', 'void', 'try', 'catch', 'final', 'main', \
                    'vector', 'execute', 'long', 'if', 'else', 'continue', 'break', 'while', 'do', 'for','size', 'is', 'new', \
                    'null', 'package', 'import', 'hashmap', 'integer', 'decimal', 'get', 'set', 'boolean','first', 'byte', 'char',\
                    'smpl', 'ordering', 'partsunlimited', 'partsunlimitedmrp', 'domain', 'mapper', 'action', 'action', 'web', 'bean', 'service', 'abstract',\
                    'list', 'map', 'lang', 'type', 'add','sub', 'next', \
                    'net', 'mongo', 'mongodb', 'jforum', 'is','dao','entities', 'util','api', 'cache', 'context', 'exception', 'search', 'repository', 'admin', 'legacy',\
                    'weblogger', 'pojo', 'business', 'util', 'planet', 'roller', 'apache', 'org', 'core', 'config', 'rendering', 'ajax', 'admin', 'editor',\
                    'tag', 'webservice', 'model', 'repository', 'service', 'controller',\
		            'api', 'cache', 'event', 'dev', 'model', 'filter', 'processor', 'util',\
                    'xwiki', 'wiki', "misc","flavor","storage","escaping","selenium","ui","webstandards","activeinstalls","admin","annotations","extension",\
                    "filter","flamingo", "skin","theme","index","linkchecker","mail","menu","messagestream","notification","observation","office","panel",\
                    "release","repository","resource","rest","scheduler","sharepage","user","directory","profile","vfs","watchlist","webjars","wiki","xclass"

Note that we modifided the semanticParser file to use these stop words.

Now run the following command.

python semanticParser.py  PartsUnlimitedMRP_words.txt   PartsUnlimitedMRPsyn.csv
C:/ProgramData/Anaconda3/python.exe semanticParser.py PartsUnlimitedMRP_words.txt   PartsUnlimitedMRPsyn.csv

Finally, run the cosine function!

python semanticCosin.py  PartsUnlimitedMRPsyn.csv   PartsUnlimitedMRPsynsim.csv
C:/ProgramData/Anaconda3/python.exe semanticCosin.py  PartsUnlimitedMRPsyn.csv   PartsUnlimitedMRPsynsim.csv

C:/ProgramData/Anaconda3/python.exe classstatis.py PartsUnlimitedMRPClassNames.csv PartsUnlimitedMRPsynsim.csv

To validate PartsUnlimitedMRP values we looked at five of the 2415 lines to compare weights to words
These lines were chosen randomly

1) smpl.ordering.MongoDBProperties,smpl.ordering.models.OrderStatus,0.0

There are no words that aren't stop words that can be found in both classes.  This makes sense to have a score of 0.

2) smpl.ordering.repositories.mongodb.MongoQuoteRepository,smpl.ordering.repositories.mongodb.models.QuoteDetails,0.7895273946259728

High frequency of the word quote is found in both documents (at least 29 times).
same as dealer, customer, and details
The weight between these two should be high thus a score above 0.7 makes sense.

3) smpl.ordering.repositories.mock.MockDealersRepository,smpl.ordering.controllers.PingController,0.0

dealer and mock are found in one but not the other.  Similiarly, ping, service, message.
No words that aren't stop words overlap which is what is expected because our weight was zero  

4) smpl.ordering.repositories.mongodb.models.Dealer,smpl.ordering.repositories.RepositoryFactory,0.41244701967972985

dealer is a common and frequent word between the two but appears to be the only similiar word.  A
score of 0.4 could be expected given the lack of variety of words but the high frequency of the one
between the two.

5) smpl.ordering.repositories.mongodb.models.Dealer,smpl.ordering.AppInsightsFilter,0.0

There are no similiar words between the two that aren't stop words.  A score of zero makes sense.
