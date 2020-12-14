# ABLE PropertyMapping Modul

Dieses Modul bietet Zugang zur Datenbank des Property Mappings, welches stage-übergreifende Kategorien und Eigenschaften bereitstellt. Zur Nutzung muss das Modul über `require` eingebunden werden. Außerdem muss die Datenbank mit `initDatabase()` initialisiert werden, wobei sowohl die AWS Access Key ID als auch der AWS Secret Key übergeben werden müssen. Der Key muss berechtigt sein DynamoDBs zu lesen.

**Beispielverwendung**

```javascript
const mapping = require('@ablegroup/propertymapping');
mapping.initDatabase(accessKeyID, secretAccessKey);
const categories = await mapping.getAllCategories(stage);
```
## Klassen

### Category

Eine `Category` beschreibt eine Kategorie im d.3 und wird durch die Auflistung der Kategorien unter dem Endpunkt `/dms/r/{{repoID}}/source` definiert. Sie ist eine reine Datenpräsentation und bietet keine eigenen Methoden.

#### Variablen
| Variable | Datentyp | Beschreibung |
|----------|----------|--------------|
| `categoryID`  | String | Durch die Datenbank vergebene UUID einer Kategorie |
| `categoryKey` | String | ID einer Kategorie im d.3 |
| `displayname`  | String | Anzeigename einer Kategorie im d.3 |
| `writeAccess`  | boolean | Berechtigung für User Werte zu ändern |
| `children`  | String[] | Liste der Kindkategorien (anhand des categoryKey) |
| `parent`  | String | Elternkategorie (anhand des categoryKey) |

### Property

Eine `Property` beschreibt eine Eigenschaft im d.3 und wird durch die Auflistung der Eigenschaften unter dem Endpunkt `/dms/r/{{repoID}}/objdef` definiert. Eigenschaften werden für jede Nutzung in einer Kategorie einzeln hinterlegt. So kann es sein, dass das Feld "E-Mail" im d.3 unter `/dms/r/{{repoID}}/source` nur einmal auftaucht, aber durch die Nutzung in mehreren Kategorien auch mehrfach angelegt wird. Sie ist eine reine Datenpräsentation und bietet keine eigenen Methoden.

#### Variablen

| Variable | Datentyp | Beschreibung |
|----------|----------|--------------|
| `propertyID`  | String | Durch die Datenbank vergebene UUID einer Eigenschaft |
| `displayname` | String | Anzeigename einer Eigenschaft im d.3 |
| `databasePosition` | Number | Datenbankposition im d.3, abhängig von der Kategorie |
| `categoryKey` | String | ID der übergeordneten Kategorie im d.3 |
| `mandatory`  | boolean | Pflichtfeld |
| `modifiable`  | boolean | Berechtigung für User Werte zu ändern |
| `propertyKey`  | Number | ID einer Eigenschaft im d.3, stage-abhängig |

## Methoden

### Initialisierung der Datenbank

```javascript
mapping.initDatabase(accessKeyID, secretAccessKey);
```

#### Funktionsparameter
| Parameter | Beschreibung  |
|-----------|---------------|
| `accessKeyID`  | ID des Access Keys des zu nutzenden AWS-Accounts |
| `secretAccessKey` | Secret Access Key des zu nutzenden AWS-Accounts |

### Laden aller Kategorien

```javascript
const categories = await mapping.getAllCategories(stage);
```

Lädt alle in der Datenbank verfügbaren Kategorien zu einer Stage.

#### Funktionsparameter
| Parameter | Beschreibung | Beispiel |
|-----------|-----------------------------|---------|
| `stage`   | Zu durchsuchende d.3-Stage  | `'dev'` |

#### Rückgabewert
| Datentyp | Beschreibung  |
|-----------------|--------|
| `Category[]` oder <br>`[]`  | Liste der Kategorien in der Datenbank |


### Suche nach bestimmter Kategorie

```javascript
const category = await mapping.getCategory(stage, categoryID, categoryKey, displayName);
```

Lädt eine Kategorie anhand eines eindeutigen Filerparameters. Zur Suche nach einer Kategorie muss mindestens ein Filterparameter gesetzt sein.

#### Funktionsparameter
| Parameter | Beschreibung | Beispiel |
|----------|--------|--------------|
| `stage`  | Zu durchsuchende d.3-Stage| `'dev'` ||
| `categoryID`  | _Filterparameter, optional_<br>ID der Kategorie in der Datenbank  | `'c84c89c6-a5ac-4e77-a719-6cad29b74906'` |
| `categoryKey` | _Filterparameter, optional_<br>ID der Kategorie im d.3  |`'XAPER'` |
| `displayName` | _Filterparameter, optional_<br>Anzeigename der Kategorie  | `'Personalakte'`|

#### Rückgabewert
| Datentyp | Beschreibung  |
|-----------------|--------|
| `Category` oder <br>`undefined`  | Gefundene Kategorie entsprechend der Filterparameter oder <br> `undefined`, wenn keine Kategorie gefunden wurde |


### Suche nach Kind-Kategorie

```javascript
const categories = await mapping.getCategoryByParent(stage, categoryID, categoryKey, displayName);
```

Lädt die Kindkategorien einer Kategorie anhand eines eindeutigen Filerparameters. Zur Suche nach einer Kategorie muss mindestens ein Filterparameter gesetzt sein.

#### Funktionsparameter
| Parameter | Beschreibung | Beispiel |
|----------|--------|--------------|
| `stage`  | Zu durchsuchende d.3-Stage| `'dev'` |
| `categoryID`  | _Filterparameter, optional_<br>ID der Kategorie in der Datenbank  | `'c84c89c6-a5ac-4e77-a719-6cad29b74906'` |
| `categoryKey` | _Filterparameter, optional_<br>ID der Kategorie im d.3  |`'XAPER'` |
| `displayName` | _Filterparameter, optional_<br>Anzeigename der Kategorie  | `'Personalakte'`|

#### Rückgabewert
| Datentyp | Beschreibung  |
|-----------------|------------|
| `Category[]` oder <br>`[]`  | Gefundene Kindkategorien entsprechend der Filterparameter |

### Suche nach Eltern-Kategorie

```javascript
const category = await mapping.getCategoryByChildren(stage, categoryID, categoryKey, displayName);
```

Lädt die Elternkategorie einer Kategorie anhand eines eindeutigen Filerparameters. Zur Suche nach einer Kategorie muss mindestens ein Filterparameter gesetzt sein.

#### Funktionsparameter
| Parameter | Beschreibung | Beispiel |
|----------|--------|--------------|
| `stage`  | Zu durchsuchende d.3-Stage| `'dev'` |
| `categoryID`  | _Filterparameter, optional_<br>ID der Kategorie in der Datenbank  | `'c84c89c6-a5ac-4e77-a719-6cad29b74906'` |
| `categoryKey` | _Filterparameter, optional_<br>ID der Kategorie im d.3  |`'XAPER'` |
| `displayName` | _Filterparameter, optional_<br>Anzeigename der Kategorie  | `'Personalakte'`|

#### Rückgabewert
| Datentyp | Beschreibung  |
|-----------------|--------|
| `Category` oder <br>`undefined`  | Gefundene Elternkategorie entsprechend der Filterparameter oder <br> `undefined`, wenn keine Kategorie gefunden wurde |

### Laden aller Eigenschaften

```javascript
const properties = await mapping.getAllProperties(stage);
```

Lädt alle in der Datenbank verfügbaren Eigenschaften zu einer Stage.

#### Funktionsparameter
| Parameter | Beschreibung | Beispiel |
|----------|--------|--------------|
| `stage`  | Zu durchsuchende d.3-Stage| `'dev'` |

#### Rückgabewert
| Datentyp | Beschreibung  |
|-----------------|------------|
| `Property[]` oder <br>`[]`  | Liste der Eigenschaften in der Datenbank |

### Suche nach bestimmter Eigenschaft

```javascript
const property = await mapping.getProperty(stage, propertyID, displayName, databasePosition, categoryKey, propertyKey);
```

Lädt eine Eigenschaft anhand eines eindeutigen Filerparameters. Zur Suche nach einer Eigenschaft muss mindestens ein Filterparameter gesetzt sein. Die Filter `databasePosition` und `categoryKey` müssen stets zusammen angegeben werden, da die Datenbankpositionen nur je Kategorie eindeutig sind.

#### Funktionsparameter
| Parameter | Beschreibung | Beispiel |
|----------|--------|--------------|
| `stage`  | Zu durchsuchende d.3-Stage| `'dev'` ||
| `propertyID`  | _Filterparameter, optional_<br>ID der Eigenschaft in der Datenbank  | `'c84c89c6-a5ac-4e77-a719-6cad29b74906'` |
| `displayName` | _Filterparameter, optional_<br>Anzeigename der Eigenschaft  |`'Personalnummer'` |
| `databasePosition` | _Filterparameter, optional_<br>Datenbankposition der Eigenschaft  | `12`|
| `categoryKey` | _Filterparameter, optional_<br>ID der übergeordneten Kategorie im d.3   | `'XAPER'`|
| `propertyKey` | _Filterparameter, optional_<br>ID der Eigenschaft im d.3, stage-spezifisch  | `47`|

#### Rückgabewert
| Datentyp | Beschreibung  |
|-----------------|--------|
| `Property` oder <br>`undefined`  | Gefundene Eigenschaft entsprechend der Filterparameter oder <br> `undefined`, wenn keine Eigenschaft gefunden wurde |

### Laden aller Eigenschaften zu einer Kategorie

```javascript
const properties = await mapping.getPropertiesByCategory(stage, categoryID, categoryKey, displayName);
```

Lädt alle Eigenschaften, die zu einer (anhand der Filterparameter definierten) Kategorie gehören.

#### Funktionsparameter
| Parameter | Beschreibung | Beispiel |
|----------|--------|--------------|
| `stage`  | Zu durchsuchende d.3-Stage| `'dev'` |
| `categoryID`  | _Filterparameter, optional_<br>ID der Kategorie in der Datenbank  | `'c84c89c6-a5ac-4e77-a719-6cad29b74906'` |
| `categoryKey` | _Filterparameter, optional_<br>ID der Kategorie im d.3  |`'XAPER'` |
| `displayName` | _Filterparameter, optional_<br>Anzeigename der Kategorie  | `'Personalakte'`|

#### Rückgabewert
| Datentyp | Beschreibung  |
|-----------------|------------|
| `Property[]` oder <br>`[]` oder <br> `undefined`  | Gefundene Eigenschaften innerhalb der Kategorie oder <br> `undefined`, wenn keine Kategorie gefunden wurde |


## Exceptions
| Titel | Beschreibung | Lösung |
|-----------------|--------|--------------|
| `Stage is not available`  | Es wurde eine nicht vorhandene Stage übergeben. | Übergabe einer verfügbaren Stage (aktuell `dev`, `qas`, `version`, `prod`). |
| `No params found, provide at least one param to search for`  | Es wurden keine Filterparameter übergeben. | Übergabe mindestens eines Filterparameters. |
| `CategoryKey and DatabasePosition are required in order to search by them`  | Es wurde eine Kategorie, aber kein Datenbankfeld (oder umgekehrt) übergeben. | Übergabe von Kategorie-Key und Datenbankposition oder Übergabe keines dieser Parameter.
| `Database was not initialized`  | Die Datenbank wurde vor der Nutzung nicht initialisiert. | Aufruf von `mapping.initDatabase(accessKeyID, secretAccessKey);` zu Beginn