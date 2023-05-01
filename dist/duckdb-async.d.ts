/**
 * A wrapper around DuckDb node.js API that mirrors that
 * API but uses Promises instead of callbacks.
 *
 */
import * as duckdb from "duckdb";
type Callback<T> = (err: duckdb.DuckDbError | null, res: T) => void;
export { DuckDbError, QueryResult, RowData, TableData, OPEN_CREATE, OPEN_FULLMUTEX, OPEN_PRIVATECACHE, OPEN_READONLY, OPEN_READWRITE, OPEN_SHAREDCACHE, } from "duckdb";
export declare class Connection {
    private conn;
    private constructor();
    /**
     * Static method to create a new Connection object. Provided because constructors can not return Promises,
     * and the DuckDb Node.JS API uses a callback in the Database constructor
     */
    static create(db: Database): Promise<Connection>;
    all(sql: string, ...args: any[]): Promise<duckdb.TableData>;
    arrowIPCAll(sql: string, ...args: any[]): Promise<duckdb.ArrowArray>;
    /**
     * Executes the sql query and invokes the callback for each row of result data.
     * Since promises can only resolve once, this method uses the same callback
     * based API of the underlying DuckDb NodeJS API
     * @param sql query to execute
     * @param args parameters for template query
     * @returns
     */
    each(sql: string, ...args: [...any, Callback<duckdb.RowData>] | []): void;
    /**
     * Execute one or more SQL statements, without returning results.
     * @param sql queries or statements to executes (semicolon separated)
     * @param args parameters if `sql` is a parameterized template
     * @returns `Promise<void>` that resolves when all statements have been executed.
     */
    exec(sql: string, ...args: any[]): Promise<void>;
    prepareSync(sql: string, ...args: any[]): Statement;
    prepare(sql: string, ...args: any[]): Promise<Statement>;
    runSync(sql: string, ...args: any[]): Statement;
    run(sql: string, ...args: any[]): Promise<Statement>;
    register_udf(name: string, return_type: string, fun: (...args: any[]) => any): void;
    unregister_udf(name: string): Promise<void>;
    register_bulk(name: string, return_type: string, fun: (...args: any[]) => any): void;
    stream(sql: any, ...args: any[]): duckdb.QueryResult;
    arrowIPCStream(sql: any, ...args: any[]): Promise<duckdb.IpcResultStreamIterator>;
    register_buffer(name: string, array: duckdb.ArrowIterable, force: boolean): Promise<void>;
    unregister_buffer(name: string): Promise<void>;
}
export declare class Database {
    private db;
    private constructor();
    /**
     * Static method to create a new Database object. Provided because constructors can not return Promises,
     * and the DuckDb Node.JS API uses a callback in the Database constructor
     */
    /**
     * Static method to create a new Database object from the specified file. Provided as a static
     * method because some initialization may happen asynchronously.
     * @param path path to database file to open, or ":memory:"
     * @returns a promise that resolves to newly created Database object
     */
    static create(path: string, accessMode?: number): Promise<Database>;
    close(): Promise<void>;
    get_ddb_internal(): duckdb.Database;
    connect(): Promise<Connection>;
    all(sql: string, ...args: any[]): Promise<duckdb.TableData>;
    arrowIPCAll(sql: string, ...args: any[]): Promise<duckdb.ArrowArray>;
    /**
     * Executes the sql query and invokes the callback for each row of result data.
     * Since promises can only resolve once, this method uses the same callback
     * based API of the underlying DuckDb NodeJS API
     * @param sql query to execute
     * @param args parameters for template query
     * @returns
     */
    each(sql: string, ...args: [...any, Callback<duckdb.RowData>] | []): void;
    /**
     * Execute one or more SQL statements, without returning results.
     * @param sql queries or statements to executes (semicolon separated)
     * @param args parameters if `sql` is a parameterized template
     * @returns `Promise<void>` that resolves when all statements have been executed.
     */
    exec(sql: string, ...args: any[]): Promise<void>;
    prepareSync(sql: string, ...args: any[]): Statement;
    prepare(sql: string, ...args: any[]): Promise<Statement>;
    runSync(sql: string, ...args: any[]): Statement;
    run(sql: string, ...args: any[]): Promise<Statement>;
    register_udf(name: string, return_type: string, fun: (...args: any[]) => any): void;
    unregister_udf(name: string): Promise<void>;
    stream(sql: any, ...args: any[]): duckdb.QueryResult;
    arrowIPCStream(sql: any, ...args: any[]): Promise<duckdb.IpcResultStreamIterator>;
    serialize(): Promise<void>;
    parallelize(): Promise<void>;
    wait(): Promise<void>;
    interrupt(): void;
    register_buffer(name: string, array: duckdb.ArrowIterable, force: boolean): Promise<void>;
    unregister_buffer(name: string): Promise<void>;
    registerReplacementScan(replacementScan: duckdb.ReplacementScanCallback): Promise<void>;
}
export declare class Statement {
    private stmt;
    /**
     * Construct an async wrapper from a statement
     */
    private constructor();
    /**
     * create a Statement object that wraps a duckdb.Statement.
     * This is intended for internal use only, and should not be called directly.
     * Use `Database.prepare()` or `Database.run()` to create Statement objects.
     */
    static create_internal(stmt: duckdb.Statement): Statement;
    all(...args: any[]): Promise<duckdb.TableData>;
    arrowIPCAll(...args: any[]): Promise<duckdb.ArrowArray>;
    /**
     * Executes the sql query and invokes the callback for each row of result data.
     * Since promises can only resolve once, this method uses the same callback
     * based API of the underlying DuckDb NodeJS API
     * @param args parameters for template query, followed by a NodeJS style
     *             callback function invoked for each result row.
     *
     * @returns
     */
    each(...args: [...any, Callback<duckdb.RowData>] | []): void;
    /**
     * Call `duckdb.Statement.run` directly without awaiting completion.
     * @param args arguments passed to duckdb.Statement.run()
     * @returns this
     */
    runSync(...args: any[]): Statement;
    run(...args: any[]): Promise<Statement>;
    finalize(): Promise<void>;
}
