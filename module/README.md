# ABLE PropertyMapping module

Dieses Modul bietet Zugang zur Datenbank des Property Mappings, welches stage-übergreifende Kategorien und Eigenschaften bereitstellt. Zur Nutzung muss das Modul über `require` eingebunden werden. Außerdem muss die Datenbank mit `initDatabase()` initialisiert werden, wobei sowohl der AWS Access Key als auch der AWS Secret Key übergeben werden müssen. Der Key muss berechtigt sein DynamoDBs zu lesen.

## Methoden