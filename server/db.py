import sqlite3

conn = sqlite3.connect('dashboard.db')

__DB_INIT = """
create table if not exists temperatures (
    id integer primary key,
    value int
)
""""

class Dashboard(object):

    def __init__(self, parameter_list):
        self.conn = sqlite3.connect('example.db')
        c = conn.cursor()
        c.execute("__DB_INIT")

    def add_temperatures(self, value):
        c = conn.cursor()
        c.execute("insert into temperatures values (NULL, ?)", value)
        self.conn.commit()
