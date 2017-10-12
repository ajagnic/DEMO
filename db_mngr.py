import sqlite3 as db
import location_list

test_locations = location_list.test_locations

def create_w_data():
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''CREATE TABLE locations (
    name text,
    x real,
    y real)''') #sql-like commands, data types are limited so far
    dbi.execute('''CREATE TABLE routes (
    origin text,
    dest text,
    originCoords text,
    destCoords text,
    routeTime real,
    routeDist real,
    route text)''')
    for loc in test_locations:
        dbi.execute('''INSERT INTO locations (name, x, y) VALUES (?, ?, ?)''', (loc[0], loc[1], loc[2]))
        conn.commit()
    conn.close()

def drop():
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''DROP TABLE locations''')
    dbi.execute('''DROP TABLE routes''')
    conn.commit()
    conn.close()

def read():
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''SELECT * FROM locations''')
    result = dbi.fetchall()
    conn.close()
    return result

def read_routes():
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''SELECT * FROM routes''')
    route_result = dbi.fetchall()
    conn.close()
    return route_result

def read_route_info():
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''SELECT origin, dest, originCoords, destCoords, routeTime, routeDist FROM routes''')
    route_info = dbi.fetchall()
    conn.close()
    return route_info
