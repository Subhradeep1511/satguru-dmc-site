"""Seed 38 excursion detail cards across 5 destination pages into CMS."""
import sqlite3
from datetime import datetime

DB = 'C:/satguru-dmc-new/cms/satguru-cms.db'
conn = sqlite3.connect(DB)
cur = conn.cursor()
NOW = datetime.utcnow().isoformat() + 'Z'

EXCURSIONS = [

  # ── MURMANSK (destinationSlug: murmansk-excursions) ─────────────────────────
  ('Excursion to Teriberka Village','Murmansk, Russia','9–10 Hours','Your Hotel','By Van','https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/1-Teriberka.jpg','Discover the rich history of this remote Arctic village on the shores of the Barents Sea. Marvel at dramatic coastal vistas, abandoned vessels, the famous Dragon Eggs beach, and breathtaking waterfalls. Stack stones to make a wish — a cherished local tradition. Winter visits add sled and snowmobile rides to the adventure.','murmansk-excursions',1),
  ('Saami Village','Murmansk, Russia','9–10 Hours','Your Hotel','By Van','https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/2-Saami-village.jpg','Immerse yourself in the ancient culture of the indigenous Sami people through traditional games, reindeer encounters, and thrilling banana snowmobile rides. Walk the Sacred Idols pathway and make a wish with six coins — a timeless ritual. Includes authentic meals and traditional Arctic beverages.','murmansk-excursions',2),
  ('Snowmobile Safari','Murmansk, Russia','30 Minutes','Activity Venue','Own','https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/3-Snowmobile.jpg','Race across the snow-laden Arctic tundra on a powerful snowmobile, weaving through dense forested terrain with agility and speed. Soak in the magnificent views of the endless snow-covered hills stretching to the horizon — an experience that truly captures the spirit of Murmansk\'s wild north.','murmansk-excursions',3),
  ('Kirovsk City & "Snow Village"','Murmansk, Russia','9–10 Hours','Your Hotel','By Van','https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/4-Kirovsk.jpg','Step inside a breathtaking handmade ice museum with 40 halls crafted by Russian, Norwegian, and Finnish artists — theme changes each season. Optional extras include mountain climbing, ski rentals, exhilarating husky sledding, and SnowBus rides through the Khibiny mountains.','murmansk-excursions',4),
  ('"SnowBus" Safari','Murmansk, Russia','1 Hour','Activity Venue','Own','https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/5-Snowbus.jpg','Ride a powerful SnowBus through the legendary Khibiny mountain range, taking in the majestic peaks of Poachvumchorr, Takhtarvumchorr, and Vudyavrchorr. The tour includes 3 specially chosen stops at the most picturesque viewpoints — perfect for photography and unforgettable Arctic memories.','murmansk-excursions',5),
  ('Husky Sleds Riding','Murmansk, Russia','30 Minutes','Activity Venue','Own','https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/6-Husky.jpg','Let adorable Siberian Huskies whisk you through snowy Arctic landscapes on a classic dog sled ride. Enjoy the warm and friendly atmosphere of the husky farm, gather around the tea table, hear fascinating stories about the dogs, and create memories you\'ll treasure for a lifetime.','murmansk-excursions',6),
  ('Lovozero Husky Park (3-hrs Program)','Murmansk, Russia','3 Hours','Your Hotel','By Van','https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/7-Lovozero-Husky-park.jpg','Venture deep into the tundra on snowmobiles to discover the legendary Lovozero Husky Park. Meet the resident sled dogs, feed reindeer, and enjoy both dog-sled and reindeer-sled rides. Your guide shares fascinating tales of Arctic life, and the program concludes with a warm, satisfying lunch.','murmansk-excursions',7),
  ('Aurora Hunting Tour (3-hrs Program)','Murmansk, Russia','3 Hours','Your Hotel','By Van','https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/8-Northern-lights.jpg','As night falls over the Arctic, your expert guide leads you away from the city lights to the best Northern Lights viewing spots around Murmansk. Watch the sky come alive with the dancing colours of the Aurora Borealis, and capture stunning photographs with professional guidance.','murmansk-excursions',8),

  # ── MOSCOW (destinationSlug: moscow-excursions) ──────────────────────────────
  ('City Tour','Moscow, Russia','4 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/Moscow-city-tour.jpg','Get acquainted with Moscow in just 4 hours — see all the most iconic sights and learn about the history, local way of life, and traditions. Highlights include Red Square, St. Basil\'s Cathedral, GUM mall, Christ the Savior Cathedral, Moscow City Business Center, Park of Victory, Sparrow Hills observation platform, and the legendary Seven Sisters.','moscow-excursions',1),
  ('"Secrets of the City" Walking Tour','Moscow, Russia','4 Hours','Your Hotel','Public Transport','https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/Moscow-secrets-of-the-city.jpg','Dive into the old streets of the megapolis and feel as though you\'ve been transported back a couple of centuries. Explore Red Square, Tverskaya Street, Manege Square, the ancient Nikolskaya, Varvarka & Ilinka streets, the charming St. Barbara\'s Church, and the modern Zaryadye park.','moscow-excursions',2),
  ('The Kremlin','Moscow, Russia','4 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/Moscow-Kremlin.jpg','The oldest and only functioning fortress in Europe — built in the 15th century and still at the heart of Russian power today. Explore the magnificent fortress architecture, the Russian President\'s residency, the oldest cathedrals, the Patriarch\'s Palace, and the legendary Tsar-Bell and Tsar-Cannon.','moscow-excursions',3),
  ('Traces of the Soviet Empire','Moscow, Russia','4 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/Moscow-Traces-of-the-Soviet.jpg','Explore the splendour and contrasts of the world\'s first communist country. Visit the grand Stalinist architecture of VDNH park and dive into the extraordinary history of space exploration at the Museum of Cosmonautics — a fascinating journey through an era that changed the world forever.','moscow-excursions',4),
  ('Moscow Metro & The Old Arbat Street','Moscow, Russia','4 Hours','Your Hotel','Metro','https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/Moscow-Metro.jpg','Moscow\'s metro is recognised as the most beautiful and safest in the world. Opened in 1935, it is also one of the oldest metro systems on Earth. Ride through its spectacular stations — each a masterpiece of Soviet architecture — then stroll the famous Old Arbat Street.','moscow-excursions',5),
  ('Cruise by Radisson Royal','Moscow, Russia','2.5 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/Moscow-radisson-cruise-2.jpg','Enjoy your time aboard the luxurious Radisson Royal yacht, sailing the Moscow River to the sound of beautiful music while admiring magical city views from the water. Optional restaurant food and beverages are available on board — ideal for a romantic evening or a sophisticated group experience.','moscow-excursions',6),
  ('Bar Tour','Moscow, Russia','From Dusk Till Dawn','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/Moscow-Bar-tour.jpg','The megapolis never sleeps — enjoy Moscow\'s legendary nightlife by visiting the best bars and clubs the city has to offer. A qualified and knowledgeable guide accompanies you throughout the night, ensuring an authentic, safe, and memorable experience. Available Friday to Sunday only.','moscow-excursions',7),
  ('Military Tour','Moscow, Russia','4.5 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/Moscow-Military-tour.jpg','Experience the thrill of riding tanks at former USSR military bases and try your hand at shooting from the famous AK-47 Kalashnikov assault rifle or the classic Makarov pistol — an utterly unforgettable adventure.','moscow-excursions',8),
  ('Flight in Weightlessness','Moscow, Russia','3 Hours','Lobby of Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/Moscow-Flight-in-weightlessness.jpg','Board the special IL-76 MDK plane-laboratory used to train cosmonauts and experience true weightlessness. The aircraft follows Kepler\'s Parabola trajectory, giving you 10 weightless regimes of 25–28 seconds each — one of the most extraordinary experiences available to civilians anywhere in the world.','moscow-excursions',9),

  # ── KAZAN (destinationSlug: kazan-excursions) ────────────────────────────────
  ('City Tour','Kazan, Russia','4 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Kazan-City-tour.jpeg','Explore the historical heart of the capital of Tatarstan — wander through the Old Tatar settlement with its colourful houses and souvenir shops, stroll along the shores of Lake Kaban, and walk down Kremlevskaya Street where the historic building of Kazan University stands proud.','kazan-excursions',1),
  ('Kazan Kremlin Tour','Kazan, Russia','3 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Kazan-Kremlin.jpg','A walking tour through one of Russia\'s UNESCO-listed fortresses. Marvel at the stunning Kul Sharif Mosque and the ancient Cathedral of the Annunciation, hear the legend of the leaning Syuyumbike Tower, and enjoy sweeping panoramic views from the Kremlin observation deck.','kazan-excursions',2),
  ('Gastronomic Tour','Kazan, Russia','3 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Kazan-Gastronomic-tour-2.jpg','Savour the rich flavours of Tatar national cuisine — join a master class on preparing traditional pastries and sweets, complete with tastings. Visit the famous Chak-Chak Museum to discover the story of Tatarstan\'s beloved national treat over a warm cup of tea.','kazan-excursions',3),
  ('Ecotourism Park "Wild Farm"','Kazan, Russia','3 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Kazan-Ecotourism-park-Wild-Farm.jpg','Escape into nature at this magnificent 400-hectare natural reserve just 130 km from Kazan. Home to sika deer and marals roaming freely in their natural environment, the park offers a truly peaceful retreat into the forest — a perfect contrast to the city\'s rich cultural heritage.','kazan-excursions',4),
  ('Downtown Walking Tour','Kazan, Russia','3 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Kazan-Downtown-walking-tour.jpg','Walk one of the oldest streets in the city and meander through the serene Black Lake park. Discover the interactive "City Panorama" museum, visit historic cathedral sites, and stroll through the famous university campus with its landmark astronomical observatory.','kazan-excursions',5),
  ('All Religions Cathedral','Kazan, Russia','2 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Kazan-All-religions-cathedral.jpg','A truly unique architectural marvel — a single complex uniting symbols of the world\'s great faiths under one roof. Explore the Orthodox and Catholic churches, the mosque, synagogue, Buddhist and Krishna temples, and a pagoda, all coexisting in perfect harmony.','kazan-excursions',6),

  # ── SOCHI (destinationSlug: sochi-excursions) ────────────────────────────────
  ('Eco Tour to Matsesta Valley','Sochi, Russia','5 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-Eco-tour-to-Matsesta-1.jpg','Visit the world\'s northernmost tea plantations and a working eco-farm nestled inside Sochi National Park. Learn the fascinating process of tea production from leaf to cup, taste organic products with freshly-made pancakes and honey, and capture stunning photographs amidst the lush sub-tropical landscape.','sochi-excursions',1),
  ('Horse Riding','Sochi, Russia','4 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-horse-riding.jpg','Ride through the scenic outskirts of Sochi on gentle horses, taking in breathtaking views of Kudepsta, the ancient Yewsamshite grove with its rare relict trees, mountain rivers, the dramatic River Canyon, Kudepsta Gorge, and an observation deck over the Olympic Park. Children aged 4+ welcome.','sochi-excursions',2),
  ('Boat Trip','Sochi, Russia','5 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-boat-1.jpg','Set sail on a luxury yacht along the Black Sea coast, with the chance to swim in the open sea and spot playful dolphins. Equipped with blankets and pillows for comfort, the yacht can also be arranged for onboard dining or a romantic sunset cruise.','sochi-excursions',3),
  ('Roza Khutor & Krasnaya Polyana','Sochi, Russia','6 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-Roza-khutor-1.jpg','Journey into the stunning Caucasus Mountains to explore Krasnaya Polyana — breathtaking natural panoramas, authentic Caucasian cuisine, a natural narzan mineral spring, and three world-class ski resorts. Relive the legacy of the 2014 Winter Olympics and end the day at the spectacular fountain shows in Olympic Park.','sochi-excursions',4),
  ('City Tour','Sochi, Russia','6 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-city-tour-1.jpg','Take in sweeping panoramic views of Sochi from atop Mount Akhun and the Ferris Wheel at 701 metres elevation. Explore the vibrant Riviera park and the historic Sea Port, then round off the day with tastings of the finest local wine, honey, and artisan cheese.','sochi-excursions',5),
  ('Waterfalls','Sochi, Russia','10 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-33-waterfalls-1.jpg','Trek to 33 magnificent waterfalls cascading crystal-clear mountain water through rare and ancient plants. Seventeen falls are easily accessible, with the tallest reaching nearly 11 metres. Legend has it each waterfall marks a giant\'s footprint — an awe-inspiring natural spectacle.','sochi-excursions',6),

  # ── SAINT PETERSBURG (destinationSlug: saint-petersburg-excursions) ──────────
  ('City Tour','St. Petersburg, Russia','4 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.Petersburg-City-tour.jpg','Discover the greatest landmarks of the Venice of the North — the grand Palace Square, the iconic Winter Palace and State Hermitage Museum, the imposing Peter and Paul Fortress, the famous Bronze Horseman monument, and the magnificent Kazan Cathedral.','saint-petersburg-excursions',1),
  ('State Hermitage Museum','St. Petersburg, Russia','3 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.Petersburg-Hermitage.jpeg','The second largest museum in the world (after the Louvre in Paris). Founded by Catherine the Great in 1764 and housed in the spectacular former royal residence, its vast collections span centuries of human civilisation.','saint-petersburg-excursions',2),
  ('Peter & Paul Fortress','St. Petersburg, Russia','2 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.Petersburg-Peter-and-Paul-fort.jpg','Explore the island fortress where Saint Petersburg was born. Home to the city\'s oldest cathedral dedicated to SS Peter and Paul — this historic site has served as the burial place of nearly all Russian rulers and their family members since the 18th century.','saint-petersburg-excursions',3),
  ('Cathedral of the Savior on Spilled Blood','St. Petersburg, Russia','1 Hour','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.Petersburg-Cathjedral-of-the-Saviour-on-Spilled-blood.jpg','Built on the exact spot where Emperor Alexander II was mortally wounded in 1881. A breathtaking masterpiece of Late Russian Style architecture adorned with 7,500 square metres of intricate mosaics depicting biblical scenes.','saint-petersburg-excursions',4),
  ('Boat Ride on Neva River','St. Petersburg, Russia','2 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.Petersburg-boat-ride.jpg','Glide along the network of rivers and canals that weave through the city\'s distinct districts. From the water, the magnificent architecture of Saint Petersburg reveals itself in a completely new light — great vistas of the city unfold one after another.','saint-petersburg-excursions',5),
  ('Peterhof Park & Palace','St. Petersburg, Russia','5–6 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.Petersburg-Peterhof-park-2048x978.jpg','Often called the "Russian Versailles," this world-famous palace and park complex on the Gulf of Finland shore attracts millions of visitors every year. The Grand Palace\'s magnificent architecture and spectacular fountain cascades have inspired poets and artists for centuries.','saint-petersburg-excursions',6),
  ('Katherine\'s Palace & The Amber Room','St. Petersburg, Russia','5–6 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.Petersburg-Catherine-palace.jpg','Built over the 18th–19th centuries, this 325-metre decorated palace dazzles with gilded sculptures and opulent interiors. At its heart lies the legendary Amber Room — considered a masterpiece of 18th-century jewellery art.','saint-petersburg-excursions',7),
  ('Shuvalovka Village','St. Petersburg, Russia','5 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.Petersburg-Shuvalovka-village.jpg','Step back to 1714 in this beautifully recreated traditional Northern Russian settlement of authentic log cabins. Year-round festivals, sports tournaments, and folk fairs bring history to life. In winter, enjoy ice skating, sledding, horse-drawn sleigh rides, and horseback riding.','saint-petersburg-excursions',8),
  ('"Feel Yourself Russian" Folklore Show','St. Petersburg, Russia','3 Hours','Your Hotel','By Cab','https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.Petersburg-Feel-yourself-Russian.jpg','An unforgettable two-hour folk performance at the Nikolaevski Palace — built by Tsar Nicholas I in 1861. Experience the soul of Russia through vibrant folk songs and traditional regional dances from across the country, ranked among St. Petersburg\'s top visitor attractions.','saint-petersburg-excursions',9),
]

print(f"Inserting {len(EXCURSIONS)} excursions...")

SLUG_TO_TITLE = {
    'murmansk-excursions': 'Murmansk',
    'moscow-excursions': 'Moscow',
    'kazan-excursions': 'Kazan',
    'sochi-excursions': 'Sochi',
    'saint-petersburg-excursions': 'Saint Petersburg',
    'golden-ring': 'Golden Ring',
}

inserted = 0
for (title, location, duration, start_tour, transportation, image_url, description, dest_slug, order) in EXCURSIONS:
    # Skip if already exists
    cur.execute("SELECT id FROM excursions WHERE title=? AND destination_slug=?", (title, dest_slug))
    if cur.fetchone():
        print(f"  SKIP (exists): {title} [{dest_slug}]")
        continue

    dest_title = SLUG_TO_TITLE.get(dest_slug, dest_slug)
    cur.execute("""
        INSERT INTO excursions
            (title, location, duration, start_tour, transportation,
             image_url, description, destination_slug, destination_title,
             home_feature, active, "order", destination_order, updated_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?, 0, ?, ?)
    """, (title, location, duration, start_tour, transportation,
          image_url, description, dest_slug, dest_title, order, NOW, NOW))
    inserted += 1

conn.commit()
print(f"\nDone. Inserted {inserted} excursions")

# Summary
print("\nFinal count per destination:")
cur.execute("""
    SELECT destination_slug, COUNT(*) as cnt
    FROM excursions WHERE home_feature=0
    GROUP BY destination_slug ORDER BY destination_slug
""")
for r in cur.fetchall():
    print(f"  {r[0]:35} → {r[1]} excursions")

conn.close()
