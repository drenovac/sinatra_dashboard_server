require 'rubygems'
require 'active_record'
require 'activerecord-jdbc-adapter'
require 'sqljdbc4.jar'

require 'sinatra'
require 'json'

config = {
  # :url => "jdbc:sqlserver://192.168.0.8:1433;instance=SQLEXPRESS;databaseName=edmen",
  :url => "jdbc:sqlserver://203.47.127.239;databaseName=database",
  :adapter => "jdbc",
  :username => "sa",
  :password => "password",
  :driver => 'com.microsoft.sqlserver.jdbc.SQLServerDriver'
}

get '/' do
  redirect to("/dashboard.html")
end

get '/api/v1' do
  ActiveRecord::Base.establish_connection( config )
  connection = ActiveRecord::Base.connection

  sql = "SELECT * FROM shifts_dashboard"
  response = []
  results = connection.execute(sql)
  results.each do |res|
    response << res.to_json
  end

  ActiveRecord::Base.clear_active_connections!
  '[' << response.join(',') << ']'
end

get '/api/v2' do
  ActiveRecord::Base.establish_connection( config )
  connection = ActiveRecord::Base.connection

  sql = "SELECT * FROM shifts_dashboard"
  results = connection.execute(sql)
  response = results.map do |res|
    res.to_json
  end.join(',')

  sql = <<-SQL
    SELECT id, description, category, user_1, user_2, company
    FROM codes
    WHERE category = 110
  SQL
  results = connection.execute(sql)
  totals = results.map do |res|
    res.to_json
  end.join(',')

  ActiveRecord::Base.clear_active_connections!
  %Q|{"entries": [#{response}], "totals":[#{totals}]}|
end

get '/favicon.ico' do
  return
end

# commenting out for now, since this is insecure as written
# get '/api/v1/:source' do
#   ActiveRecord::Base.establish_connection( config )
#   connection = ActiveRecord::Base.connection
# 
#   sql = "SELECT * FROM shifts_dashboard WHERE source = '#{params[:source]}'"
#   response = []
#   results = connection.execute(sql)
#   results.each do |res|
#     response << res.to_json
#   end
# 
#   ActiveRecord::Base.clear_active_connections!
#   '[' << response.join(',') << ']'
# end
