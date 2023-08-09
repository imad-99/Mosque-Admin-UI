export default abstract class QueryParams {

    public createQueryParams(params: Map<string, Object>): string {
        const queryParams = new URLSearchParams();
    
        params.forEach((value, key) => {
            queryParams.append(key, value.toString());
        });

        return "?" + queryParams.toString();
    }
}