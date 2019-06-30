# Electric Cars API
> An api that was created using scraped data from the electric cars wikipedia.

## Endpoints
- Root Endpoint `https://electric-cars-api.herokuapp.com/`

### `GET: /api/v1/manufacturers`
  * This endpoint will provide all manufacturers in json format.
  * You can expect to receive an array of JSON objects.

```
[
  {
    id: 1,
    manufacturer: "BMW",
    created_at: "2019-06-28T16:13:12.176Z",
    updated_at: "2019-06-28T16:13:12.176Z"
  },
  {
    id: 2,
    manufacturer: "BMW Brilliance",
    created_at: "2019-06-28T16:13:12.176Z",
    updated_at: "2019-06-28T16:13:12.176Z"
    },
  {
    id: 3,
    manufacturer: "Bolloré",
    created_at: "2019-06-28T16:13:12.176Z",
    updated_at: "2019-06-28T16:13:12.176Z"
  },
  ......
]
```

### `GET: /api/v1/manufacturers/:id`
  * This endpoint expects an param to be passed in the url, the id represents the id of a single manufacturer
  * You can expect receive a single JSON object.

```
// `https://electric-cars-api.herokuapp.com/api/v1/manufacturers/38`

{
  id: 38,
  manufacturer: "Tesla",
  created_at: "2019-06-28T16:13:12.176Z",
  updated_at: "2019-06-28T16:13:12.176Z"
}
```

### `GET: /api/v1/cars`
  * This endpoint will provide all cars in json format.
  * You can expect to receive an array of JSON objects.

```
[
  {
    id: 1,
    manuf_id: 1,
    model: "i3",
    top_speed: "150 km/h (93 mph)",
    acceleration: "8 s",
    capacity: "4",
    charge_time: "4h - 6h with the 240 V charging unit or 30 - 40 minutes at public DC charging stations (when charging from 0 to 80%)",
    range: "246 km (153 mi)[1] MY 2019 (120 A·h) (EPA) 183 km (114 mi)[2] MY 2017/18 (94 A·h) (EPA)130 km (81 mi)[2]MY 2014/17 (60 A·h) (EPA)",
    date_and_sales: "Released in Europe in 2013 and in 2014 in the U.S.A gasoline-powered range extender option is available to increased range to 240 km (150 mi) (EPA rating).[3]Starting with the model year 2017, released in July 2016, two battery options are available, 94 A·h and 60 A·h.[2]. For the 2019 model year, a larger 120 A·h battery became the only option, and the Range Extender was discontinued in some markets. [1]",
    created_at: "2019-06-28T16:13:12.256Z",
    updated_at: "2019-06-28T16:13:12.256Z"
  },
  {
    id: 2,
    manuf_id: 2,
    model: "Zinoro 1E",
    top_speed: "130 km/h (81 mph)",
    acceleration: "7.6 s",
    capacity: "4 or 5 depending on size of passenger",
    charge_time: "",
    range: "150 km (93 mi)[4]",
    date_and_sales: "Released in China in early 2014.[5]",
    created_at: "2019-06-28T16:13:12.307Z",
    updated_at: "2019-06-28T16:13:12.307Z"
  }
  ......
]
```

### `GET: /api/v1/cars/:id`
  * This endpoint expects an param to be passed in the url, the id represents the id of a single car
  * You can expect receive a single JSON object.

```
// `https://electric-cars-api.herokuapp.com/api/v1/cars/38`

{
  id: 44,
  manuf_id: 38,
  model: "Model 3",
  top_speed: "210 km/h (130 mph) (STD) - 261 km/h (162 mph) (LR)",
  acceleration: "5.6 s (RWD base model) - 3.3 s (AWD with Performance package)",
  capacity: "5",
  charge_time: "7.3h for 100%, ~14% per hour with home charger, 50% in ~30 minutes from a Tesla Supercharger",
  range: "560 km (348 mi) WLTP (long range)[51] 523 km (325 mi) (AWD) - 425 km (264 mi) (RWD)[52]",
  date_and_sales: "Released in the US in July 2017. 28,386 units as of end of Q2 2018.",
  created_at: "2019-06-28T16:13:12.446Z",
  updated_at: "2019-06-28T16:13:12.446Z"
}
```

