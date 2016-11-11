import sqlite3
connection = sqlite3.connect('../dashboard.db3')
cursor = connection.cursor()
for row in cursor.execute("SELECT * FROM temperatures"):
	print row
